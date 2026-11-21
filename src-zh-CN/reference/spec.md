# Puddi 语言规范

<!-- Puddi release: v0.1.2 -->

> 本页翻译自 v0.1.2 的 [SPEC.md](https://github.com/puddi-lang/puddi/blob/v0.1.2/SPEC.md)。小节编号与英文原文及一致性用例一致。解释有出入时，以该发行版原文为准。覆盖情况见[一致性测试](conformance.md)。

版本为 0.1 草案。草案内容已齐备，第 14 节列出 v1 之后才考虑的功能。

## 1. 概览

Puddi 是一门静态类型、面向表达式的语言，编译为 WebAssembly。它以同一种源语言面向浏览器、WASI 运行时（服务器、边缘环境、命令行）及插件宿主，使用 WebAssembly 引擎的垃圾回收（WasmGC），通过组件模型与宿主交互。

| 主题 | 规定 |
|---|---|
| 编译目标 | 仅 WebAssembly，JavaScript 只用于加载 |
| 宿主 | `browser`、`wasi`（WASI 0.3）、`plugin` |
| 内存 | WasmGC |
| 类型 | 静态类型与局部类型推断 |
| 多态 | 泛型与名义特征，`dyn Trait` 用于动态分派 |
| 缺失值与错误 | 无 null，使用 `Option<T>`、`Result<T, E>`、支持 `From` 转换的 `?`、`Error` 和 `AnyErr`，`panic` 触发陷阱 |
| 可变性 | `let` 与 `var` 绑定，逐字段声明可变性，对象值共享引用 |
| 数值 | `Int` 为 32 位有符号整数，溢出触发陷阱，无损拓宽隐式完成 |
| 字符串 | 不透明的 `Str`，不支持整数索引 |
| 异步 | `async fn`、后缀 `.await`、结构化并发 |
| 并行 | 独立工作线程通过消息通信，不共享内存 |
| 互操作 | 主要使用组件模型与 WIT；核心模块可用 `@extern`、`@export` |
| 元编程 | v1 只有编译器内建的 `@derive` |
| 语法 | 花括号、可选分号、面向表达式 |
| 工具链 | `pud`、`pud.toml`、基于 Git 的包 |
| 源文件 | UTF-8 编码，扩展名 `.pud` |

## 2. 词法结构

### 2.1 源文本

源文件用 UTF-8 编码，扩展名为 `.pud`。标识符遵循 Unicode UAX #31，以 XID_Start 开头，后跟 XID_Continue。单独的 `_` 是通配符，不是标识符。

### 2.2 注释

```puddi
// line comment
/* block comment, may nest */
/// doc comment, attached to the next declaration
```

### 2.3 关键字

```
as      async   await   break   const   continue  dyn     else
enum    export  false   fn      for     if        impl    import
in      let     loop    match   pub     return    self    Self
struct  test    trait   true    type    var       while
```

### 2.4 命名约定

类型、特征和枚举变体采用 `UpperCamelCase`，函数、变量、字段和模块采用 `snake_case`，常量采用 `SCREAMING_SNAKE_CASE`。`pud fmt` 不会重命名，命名违反约定时应由编译器发出警告。

### 2.5 语句结束

换行结束语句。可用分号在同一行分隔多条语句。分号仅作分隔符，不改变表达式含义。

以下情况换行不结束语句：

1. 位于尚未闭合的 `(` 或 `[` 中
2. 行尾是二元运算符或逗号
3. 下一行以 `.` 开头

```puddi
let total = price * count +
    shipping                    // continues: line ends with +

let names = users
    .filter(|u| u.active)       // continues: next line starts with .
    .map(|u| u.name)
```

结构体、枚举、特征和 `match` 的成员以换行或逗号分隔。

### 2.6 数值字面量

```puddi
42    1_000    0xFF    0b1010    0o17
3.14  1e9      2.5e-3
```

整数字面量的类型取自上下文，默认为 `Int`。浮点字面量同理，默认为 `Float`。超出对应类型范围的字面量是编译错误。

### 2.7 字符字面量

`Char` 表示 Unicode 标量值，以单引号书写，例如 `'a'`、`'\n'`、`'\u{1F600}'`。

### 2.8 字符串字面量

字符串以双引号书写，支持 `{expr}` 插值。被插入的表达式必须实现 `Show`。普通花括号写作 `\{` 或 `\}`。

```puddi
let s = "hi {name}, you have {count + 1} messages"
let t = "a literal \{brace\}"
```

支持的转义为 `\n` `\r` `\t` `\0` `\\` `\"` `\'` `\{` `\}` `\u{...}`。

## 3. 类型

### 3.1 类型推断

类型推断是局部的。顶层函数签名须写出参数类型和返回类型。省略返回类型表示 `()`。局部绑定、闭包以及函数体中表达式的类型可推断。

```puddi
fn area(w: Int, h: Int) -> Int {
    let s = w * h      // inferred Int
    s
}
```

### 3.2 内建类型

| 类别 | 类型 |
|---|---|
| 布尔 | `Bool` |
| 整数 | `Int`（同 `I32`）、`I8` `I16` `I32` `I64` `U8` `U16` `U32` `U64` |
| 浮点 | `Float`（同 `F64`）、`F32` `F64` |
| 文本 | `Char`、`Str` |
| 单元 | `()` |
| 元组 | `(A, B, ...)` |
| 函数 | `fn(A, B) -> R` |
| 集合 | `List<T>`、`Map<K, V>`、`Set<T>` |
| 核心枚举 | `Option<T>`、`Result<T, E>` |

### 3.3 结构体

```puddi
struct Point {
    x: Int
    var y: Int
}

struct Pair<A, B> { a: A, b: B }
```

字段默认仅对所属模块可见，用 `pub` 公开。声明为 `var` 的字段在构造后可以赋值，其余字段不允许赋值（见 4.1）。

构造时按名称指定字段，支持字段简写及更新语法：

```puddi
let p = Point { x: 1, y: 2 }
let q = Point { x, y }          // shorthand for x: x, y: y
let r = Point { x: 5, ..p }     // copy remaining fields from p
```

### 3.4 枚举

枚举是代数数据类型。变体可以无载荷、带元组字段或带具名字段。

```puddi
enum Shape {
    Circle(Float)
    Rect { w: Float, h: Float }
    Empty
}

let s = Shape.Circle(2.0)
```

对枚举的 `match` 必须穷尽所有变体。

### 3.5 元组与单元类型

元组类型写作 `(Int, Str)`，用 `(1, "a")` 等表达式构造，用 `t.0`、`t.1` 等访问字段。单元类型及其唯一的值均写作 `()`。

### 3.6 函数类型与闭包

函数值的类型写作 `fn(Int, Int) -> Int`。命名函数和闭包均可转成函数类型。异步函数类型写作 `async fn(Int) -> Str`。

### 3.7 数值类型

`Int` 对应 Wasm `i32`，`I64` 和 `U64` 对应 `i64`，`Float` 对应 `f64`，`F32` 对应 `f32`。`I8`、`I16`、`U8`、`U16`、`U32` 以 `i32` 存储，由编译器约束取值范围。

整数溢出、除以零或对零取余触发陷阱。整数除法向零截断，余数与被除数同号。回绕、饱和、受检查运算可通过 `wrapping_add`、`saturating_add`、`checked_add` 等显式方法选择。

**拓宽**：总是无损的转换可以隐式发生。

| 原类型 | 可隐式拓宽到 |
|---|---|
| `I8` | `I16` `I32` `I64` `F32` `F64` |
| `I16` | `I32` `I64` `F32` `F64` |
| `I32` | `I64` `F64` |
| `U8` | `U16` `U32` `U64` `I16` `I32` `I64` `F32` `F64` |
| `U16` | `U32` `U64` `I32` `I64` `F32` `F64` |
| `U32` | `U64` `I64` `F64` |
| `F32` | `F64` |

`F64` 无法精确表示每个 64 位整数，因此 `I64`、`U64` 不会隐式拓宽为浮点数。

预期类型已知时允许拓宽，包括带类型标注的绑定、函数实参、返回值、字段初始化和集合元素。二元运算两侧的数值类型不同时，拓宽到能无损容纳两侧的最窄类型。若不存在这样的类型（如 `I64` 与 `U64`、`I64` 与 `Float`），则编译失败。

**窄化**：可能有损的转换必须显式指定。`to_<type>()` 返回 `Option`，无法转换时返回 `None`。也可选择 `truncate_to_int()`、`round_to_int()`、`wrap_to_u8()` 等显式的有损转换方法。

```puddi
let a: Int = 5
let b: I64 = a              // ok, widening
let c: Int = b.to_int()?    // narrowing, returns Option<Int>
```

### 3.8 字符串与字符

`Str` 是不可变、不透明的 Unicode 字符串，不支持整数索引。可用以下方式访问文本：

- `s.chars()` 按码点遍历，产生 `Char`
- `s.graphemes()` 按字素簇遍历，产生 `Str`
- `s.find("x")` 返回 `Option<StrIndex>`，`s.slice(start, end)` 接受 `StrIndex`，该索引不透明且只对生成它的字符串有效

字符串不提供取决于表示方式的 `len()`。按需使用 `s.chars().count()`、`s.graphemes().count()` 或 `s.utf8_len()`。实现可自选内部表示，包括宿主原生字符串。

### 3.9 集合

| 类型 | 写法 | 规则 |
|---|---|---|
| `List<T>` | `[1, 2, 3]` | 可增长数组 |
| `Map<K, V>` | `["a": 1, "b": 2]`，空映射为 `[:]` | `K: Eq + Hash`，保留插入顺序 |
| `Set<T>` | `Set.from([1, 2, 3])` | `T: Eq + Hash`，保留插入顺序 |

列表 `xs[i]` 要求 `Int` 索引，越界触发陷阱。`xs.get(i)` 返回 `Option<T>`。映射的 `m[k]` 在键缺失时触发陷阱，`m.get(k)` 返回 `Option<V>`。

集合同其他对象一样是引用。`List`、`Map`、`Set` 提供 `push`、`insert`、`remove` 等修改方法；`ListView`、`MapView`、`SetView` 只提供读取方法，可由对应集合隐式转换而来。

### 3.10 Option 与 Result

Puddi 没有 null。`Option<T>` 用 `Some(v)` 或 `None` 表示值可能缺失，`Result<T, E>` 用 `Ok(v)` 或 `Err(e)` 表示操作可能失败。它们是普通枚举，其变体由预导入项引入，因此可省略路径。`?` 见第 6 节。

### 3.11 泛型

类型参数用尖括号书写，类型约束跟在 `:` 后，可以用 `+` 连接。

```puddi
fn largest<T: Ord>(xs: List<T>) -> Option<T> { ... }
fn dump<T: Show + Hash>(x: T) { ... }

struct Stack<T> { var items: List<T> }
```

可在调用处推断类型实参，也可显式提供，例如 `parse<Int>(s)`。

### 3.12 特征

特征是名义性的。类型仅通过显式 `impl` 块实现特征。特征可以包含默认方法、关联类型和父特征。`Self` 指实现该特征的类型。

```puddi
trait Show {
    fn show(self) -> Str
}

trait Iterator {
    type Item
    fn next(self) -> Option<Self.Item>
}

trait Shape: Show {
    fn area(self) -> Float
    fn describe(self) -> Str { "{self.show()} with area {self.area()}" }
}

impl Show for Point {
    fn show(self) -> Str { "({self.x}, {self.y})" }
}

impl<T: Show> Show for List<T> {
    fn show(self) -> Str { ... }
}
```

**一致性**：`impl Trait for Type` 只能位于定义 `Trait` 或 `Type` 的包中。给定类型最多存在一个适用的实现。

**异步方法**：特征方法可以是 `async fn`。

**运算符特征**：通过实现以下标准特征重载运算符。

| 运算符 | 特征 |
|---|---|
| `+` `-` `*` `/` `%` | `Add` `Sub` `Mul` `Div` `Rem` |
| 一元 `-` `!` | `Neg` `Not` |
| `==` `!=` | `Eq` |
| `<` `<=` `>` `>=` | `Ord` |
| `a[i]` | `Index` |
| `for x in a` | `Iterable` |
| `"{a}"` | `Show` |

### 3.13 派生

`@derive` 指示编译器生成标准特征的实现。v1 仅支持派生内建的 `Eq`、`Ord`、`Hash`、`Show`、`Transfer`（见 9.4）。

```puddi
@derive(Eq, Ord, Hash, Show)
struct Point { x: Int, y: Int }
```

### 3.14 特征对象

`dyn Trait` 可持有任何实现了 `Trait` 的值。调用在运行时通过虚表分派。预期类型为 `dyn Trait` 时，值可隐式转换。

```puddi
let items: List<dyn Show> = [Point.new(1, 2), "hi", 42]
for it in items { print(it.show()) }
```

特征只有在方法没有自己的类型参数，且没有在接收者以外的位置引用 `Self` 时，才可用作特征对象。关联类型须固定，例如 `dyn Iterator<Item = Int>`。

特征对象支持异步方法。通过特征对象调用异步方法返回堆上分配的 future。由于 WasmGC 对象本来就在堆上，除动态分派外仅引入少量额外成本。

### 3.15 类型别名

```puddi
type UserId = Int
type Callback<T> = fn(T) -> ()
```

类型别名是目标类型的另一个名称。别名可以引用后续声明，展开时须无循环依赖。

## 4. 表达式与语句

块、`if`、`match` 和 `loop` 产生值。块的最后一个表达式给出块的值；预期类型为 `()` 时丢弃该值。赋值运算（`=`、`+=` 等）本身是类型为 `()` 的表达式。

### 4.1 绑定与可变性

`let` 声明不可重新赋值的绑定，`var` 声明可重新赋值的绑定。两者都可接受模式。绑定的可变性只控制对该绑定重新赋值。

字段的可变性在类型中声明。只有 `var` 字段在构造后允许赋值，直接对应 WasmGC 的可变与不可变字段。

结构体、枚举与集合的值是引用。赋值和传参共享对象。

```puddi
struct Point {
    x: Int        // immutable
    var y: Int    // mutable
}

let p = Point { x: 1, y: 2 }
p.y = 5        // ok, y is var
p.x = 5        // error: x is immutable
p = Point { x: 0, y: 0 }   // error: p is let

let q = p      // q and p refer to the same object
```

`==` 调用 `Eq` 比较。用预导入的 `same(a, b)` 检查引用标识。

### 4.2 运算符与优先级

从高到低如下。

| 级别 | 运算符 | 结合方向 |
|---|---|---|
| 1 | `.field` `.method()` `f()` `a[i]` `?` `.await` | 左 |
| 2 | 一元 `-` `!` | 前缀 |
| 3 | `*` `/` `%` | 左 |
| 4 | `+` `-` | 左 |
| 5 | `<<` `>>` | 左 |
| 6 | `&` | 左 |
| 7 | `^` | 左 |
| 8 | `\|` | 左 |
| 9 | `==` `!=` `<` `<=` `>` `>=` | 不结合 |
| 10 | `&&` | 左 |
| 11 | `\|\|` | 左 |
| 12 | `..` `..=` | 不结合 |
| 13 | `=` `+=` `-=` `*=` `/=` `%=` `&=` `\|=` `^=` `<<=` `>>=` | 右 |

`&&` 与 `||` 短路求值。`a..b` 右端不包含，`a..=b` 包含右端。

### 4.3 块与控制流

```puddi
let sign = if x > 0 { 1 } else if x < 0 { -1 } else { 0 }

let label = match code {
    200 -> "ok"
    404 -> "not found"
    500..=599 -> "server error"
    _ -> "other"
}
```

没有 `else` 的 `if` 类型为 `()`。`if`、`while` 与 `match` 条件中的结构体字面量必须用括号包裹。

### 4.4 模式

模式可解构元组、结构体和枚举变体，可以出现在 `let`、`var`、`match`、`for`、`if let`、`while let` 和 `let ... else` 中。

| 模式 | 例子 |
|---|---|
| 通配 | `_` |
| 绑定 | `x` |
| 字面量 | `42`、`"hi"`、`'a'`、`true` |
| 区间 | `1..=9`、`'a'..='z'` |
| 元组 | `(a, _, c)` |
| 结构体 | `Point { x, y: 0 }`、`Point { x, .. }` |
| 枚举变体 | `Some(v)`、`Shape.Rect { w, h }` |
| 或模式 | `A \| B` |
| 列表 | `[first, ..rest]`、`[]` |

`match` 分支可附加 `if` 守卫。

```puddi
let (a, b) = pair

match shape {
    Shape.Circle(r) if r > 10.0 -> "big circle"
    Shape.Circle(_) -> "circle"
    Shape.Rect { w, h } -> "rect {w}x{h}"
    Shape.Empty -> "nothing"
}

if let Some(user) = find(id) { greet(user) }

let Some(cfg) = load() else { return }
```

`let ... else` 的 `else` 块必须分岔，例如 `return`、`break`、`continue` 或 `panic`。

### 4.5 循环

```puddi
for x in xs { ... }
for (i, x) in xs.enumerate() { ... }
for i in 0..10 { ... }
while cond { ... }
while let Some(job) = queue.pop() { ... }

let found = loop {
    if done() { break value }
}
```

`break` 可以给出 `loop` 表达式的结果。`for`、`while` 类型均为 `()`。`for x in e` 要求 `e` 的类型实现 `Iterable`。

### 4.6 闭包

```puddi
let inc = |x| x + 1
let add = |a: Int, b: Int| -> Int { a + b }
let fetch = async |url| { http.get(url).await }
```

闭包按引用捕获变量。捕获 `var` 绑定的闭包可看见之后的赋值，也可以对它赋值。

### 4.7 路径

模块成员、枚举变体和关联函数统一用 `.` 分隔，例如 `io.read`、`Shape.Circle`、`Point.new(1, 2)`。

## 5. 声明

### 5.1 函数

```puddi
fn add(a: Int, b: Int) -> Int { a + b }
async fn load(url: Str) -> Result<Str, HttpErr> { ... }
```

`return` 携带值提前退出。未提前退出时函数返回函数体块的值。

### 5.2 方法

固有方法在 `impl` 块内声明，第一个参数为 `self`。不带 `self` 的是关联函数。值是引用且可变性逐字段声明，因此无需单独的可变接收者。

```puddi
impl Point {
    fn new(x: Int, y: Int) -> Point { Point { x, y } }
    fn len(self) -> Float { ... }
    fn move_down(self, dy: Int) { self.y += dy }
}

let p = Point.new(1, 2)
p.len()
```

### 5.3 常量

```puddi
const MAX_USERS: Int = 1_000
const GREETING: Str = "hi"
```

常量的初始化表达式必须是常量表达式，包括字面量、其他常量、在常量上的算术和比较，以及由常量表达式构造的结构体、元组和枚举。初始化表达式中的名称在声明该常量的模块中解析。

### 5.4 可见性

声明和结构体字段默认仅在所在模块可见。`pub` 将它们公开给其他模块和包。`export` 标记组件导出（见第 8 节）。

### 5.5 属性

属性以 `@` 开头，应用于下一个声明。

| 属性 | 含义 |
|---|---|
| `@derive(...)` | 生成标准特征实现（3.13） |
| `@target(t)` | 仅在 `browser`、`wasi` 或 `plugin` 指定目标构建时保留声明，可组合为 `@target(wasi, plugin)` |
| `@extern(module, name)` | 核心 Wasm 导入（8.4） |
| `@export(name)` | 核心 Wasm 导出（8.4） |
| `@deprecated(msg)` | 使用时发出警告 |

### 5.6 测试

`test` 块可写在任意文件中，仅由 `pud test` 编译。每项测试在新实例运行，发生 panic 或断言失败导致陷阱时测试失败。测试体可使用 `.await`。

```puddi
test "addition works" {
    assert_eq(add(2, 2), 4)
}
```

## 6. 错误处理

### 6.1 问号运算符

后缀 `?` 取出 `Ok` 或 `Some` 中的值，否则让当前函数提前返回 `Err` 或 `None`。如果 `Result` 的错误类型与函数返回的错误类型不同，`?` 通过 `From` 转换。

```puddi
enum AppErr {
    Io(IoErr)
    Bad
}

impl From<IoErr> for AppErr {
    fn from(e: IoErr) -> AppErr { AppErr.Io(e) }
}

fn load(path: Str) -> Result<Config, AppErr> {
    let text = fs.read(path)?         // IoErr converted to AppErr
    parse(text).ok_or(AppErr.Bad)
}
```

在返回 `Option` 的函数内才可对 `Option` 使用 `?`。

### 6.2 Panic

`panic(msg)` 表示无法恢复的错误。断言失败、整数溢出、除以零和索引越界也会导致 panic。它使 Wasm 实例触发陷阱，在 Puddi 内部无法捕获。插件发生陷阱时由宿主接收，宿主进程继续运行。

### 6.3 Error 与 AnyErr

错误类型宜实现 `Error`。

```puddi
trait Error: Show {
    fn source(self) -> Option<dyn Error> { None }
}
```

`source` 返回底层错误（若有），可据此遍历并显示错误链。

`AnyErr` 包装任意实现了 `Error` 的值。标准库提供 `impl<E: Error> From<E> for AnyErr`，因此 `?` 能自动转换这些错误。库宜返回自己的错误类型，应用可用 `AnyErr` 省去手写的 `From` 实现。

```puddi
fn main() -> Result<(), AnyErr> {
    let s = fs.read(path)?        // IoErr -> AnyErr
    let v = json.decode(s)?       // ParseErr -> AnyErr
    ...
}
```

`e.downcast<E>()` 返回 `Option<E>`，可恢复原始错误。`AnyErr` 通过委托被包装的值实现 `Error`。

### 6.4 main 的错误

当 `E` 实现 `Show` 时，`main` 可返回 `Result<(), E>`。返回 `Err` 时输出错误，`wasi` 上程序以失败状态退出，`browser` 上报告到控制台。

## 7. 模块与包

### 7.1 模块

每个文件是一个模块。模块路径按 `src/` 下的路径确定，例如 `src/net/http.pud` 是 `net.http`。`src/main.pud` 是程序根模块，库的根模块为 `src/lib.pud`。

```puddi
import net.http                   // use as http.get(...)
import net.http.{get, Request}    // import specific names
import net.http as h              // alias
import json                       // dependency named in pud.toml
import std.fs                     // standard library
```

包内模块之间可循环导入，包之间的依赖必须无环。

### 7.2 清单

```toml
[package]
name = "hello"
version = "0.1.0"
puddi = "0.1"

[deps]
json = "github.com/someone/puddi-json@1.2"

[target.wasi]
world = "wasi:cli/command"

[target.plugin]
world = "wit/host.wit#plugin"
```

`pud.lock` 记录每个依赖的确切提交，并纳入版本控制。

### 7.3 依赖

依赖由 Git 仓库和语义化版本标签（如 `v1.2.0`）标识。`pud.toml` 声明的是最低版本。最小版本选择为每个依赖选择满足所有约束的最低版本，因此没有锁文件时也可得到相同的版本选择。同一包的不同主版本视为不同包，可共存。

### 7.4 工具链

工具链通过 `pud` 命令提供。

| 命令 | 用途 |
|---|---|
| `pud new <name>` | 创建包 |
| `pud build [--target t]` | 构建 `browser`、`wasi` 或 `plugin` |
| `pud run` | 构建并运行，WASI 用运行时，浏览器用开发服务器 |
| `pud test` | 执行测试块 |
| `pud fmt` | 按不可配置的统一格式整理代码 |
| `pud doc` | 根据 `///` 注释生成文档 |
| `pud add <dep>` | 添加依赖 |

## 8. 宿主互操作

### 8.1 目标

| 目标 | 输出 | 入口 |
|---|---|---|
| `browser` | 组件与生成的 JS 加载器 | `fn main()`、`async fn main()` 和／或 `export fn` |
| `wasi` | `[target.wasi]` world 的 WASI 0.3 组件，默认 `wasi:cli/command` | 命令用 `fn main()` 或 `async fn main()`，其他 world 用 `export fn` |
| `plugin` | `[target.plugin]` 中宿主 world 的组件 | world 所要求的导出 |

编译器检查每个所需导出都已提供且签名匹配。`wasi` 目标需要 WASI 0.3，并用其原生异步机制，不生成 WASI 0.2 产物。

### 8.2 组件模型

组件模型是主要的互操作方式。导入 WIT 接口会生成有类型的绑定，`export fn` 将函数声明为组件导出。

```puddi
import wasi:cli/stdout
import wasi:http/outgoing-handler

export fn run() -> Result<(), AppErr> { ... }
```

### 8.3 WIT 类型映射

| WIT | Puddi |
|---|---|
| `bool` | `Bool` |
| `s8` `s16` `s32` `s64` | `I8` `I16` `I32` `I64` |
| `u8` `u16` `u32` `u64` | `U8` `U16` `U32` `U64` |
| `f32` `f64` | `F32` `F64` |
| `char` | `Char` |
| `string` | `Str` |
| `list<T>` | `List<T>` |
| `option<T>` | `Option<T>` |
| `result<T, E>` | `Result<T, E>` |
| `tuple<...>` | 元组 |
| `record` | `struct` |
| `variant`、`enum` | `enum` |
| `flags` | 生成带 `Bool` 字段的结构体 |
| `resource` | 不透明句柄类型，可提供方法 |

### 8.4 核心 Wasm 互操作

原始导入与导出直接作用于核心模块。仅数值类型与 `Str` 可直接跨越此边界，其他类型需手动编解码。

```puddi
@extern("env", "log")
fn log(msg: Str)

@export("run")
fn run() { log("hi") }
```

## 9. 并发

### 9.1 异步函数

异步显式使用 `async fn` 与后缀 `.await`。异步函数、异步闭包和测试体内才允许等待。

```puddi
async fn fetch_user(id: Int) -> Result<User, HttpErr> {
    let res = http.get("/u/{id}").await?
    res.json().await
}
```

### 9.2 结构化并发

并发子任务在作用域中启动，不可超出作用域。作用域会等全部子任务完成。子任务失败或作用域提前退出时会取消尚未完成的子任务。

```puddi
async fn load_all() -> Result<(A, B), AppErr> {
    task.scope(async |s| {
        let a = s.spawn(load_a())
        let b = s.spawn(load_b())
        (a.await?, b.await?)
    }).await
}
```

`spawn` 必须通过任务作用域调用。

### 9.3 取消

取消采用协作方式。任务在下一处 `.await` 遇到取消时提前停止，不继续执行其后的代码。长时间运行的同步循环可使用 `task.is_cancelled()` 主动检查。

### 9.4 工作线程

由于 WasmGC 对象尚不能跨线程共享，Puddi 的并行任务在工作线程运行。每个工作线程有独立的 Wasm 实例和堆，仅通过消息传递通信。

工作线程由任务作用域启动，运行顶层异步函数，结束时随作用域终止。闭包不能离开自己的实例，因此不能作为工作线程入口。线程内的 `worker.Port<In, Out>` 接收 `In`、发送 `Out`。`s.worker(f)` 返回的外部句柄则发送 `In`、接收 `Out`。

```puddi
import std.worker

@derive(Transfer)
struct Job { id: Int, data: List<Int> }

async fn summer(port: worker.Port<Job, Int>) {
    while let Some(job) = port.recv().await {
        port.send(job.data.sum())
    }
}

async fn main() {
    task.scope(async |s| {
        let w = s.worker(summer)
        w.send(Job { id: 1, data: [1, 2, 3] })
        let total = w.recv().await     // Option<Int>
        print("{total}")
    }).await
}
```

消息在实例之间深拷贝，其类型必须实现 `Transfer`。数值、`Bool`、`Char`、`Str` 以及由可传输类型组成的元组、`Option`、`Result`、集合支持它。字段均可传输的结构体和枚举可派生它。函数值、闭包和 `dyn` 值不可传输。

`browser` 提供基于 Web Workers 的 `std.worker`。其他目标只有在 world 提供工作线程接口时可用。

## 10. 标准库

### 10.1 预导入项

每个模块都可无须导入使用：

- 类型：`Bool`、`Int`、`Float`、固定宽度的数值类型、`Char`、`Str`、`List`、`Map`、`Set`、`Option`、`Result`、`AnyErr`
- 变体：`Some`、`None`、`Ok`、`Err`
- 特征：`Eq`、`Ord`、`Hash`、`Show`、`From`、`Error`、`Transfer`、`Add`、`Sub`、`Mul`、`Div`、`Rem`、`Neg`、`Not`、`Index`、`Iterable`、`Iterator`
- 函数：`print`、`panic`、`assert`、`assert_eq`、`same`

`print` 在 `wasi` 写一行到标准输出，在 `browser` 写到控制台，在 `plugin` 写到 `std.log`。

### 10.2 各目标的模块

导入目标未提供的模块会导致编译错误。

| 模块 | browser | wasi | plugin |
|---|---|---|---|
| 核心（预导入项和内置集合） | 是 | 是 | 是 |
| `std.bytes`、`std.collections`、`std.csv`、`std.date`、`std.encoding`、`std.fmt`、`std.iter`、`std.math`、`std.path`、`std.stats`、`std.text` | 是 | 是 | 是 |
| `std.json` | 是 | 是 | 是 |
| `std.log` | 是 | 是 | 是 |
| `std.time` | 是 | 是 | 依赖宿主 |
| `std.random` | 是 | 是 | 依赖宿主 |
| `std.http` | 是 | 是 | 依赖宿主 |
| `std.worker` | 是 | 依赖宿主 | 依赖宿主 |
| `std.io` | — | 是 | — |
| `std.fs` | — | 是 | — |
| `std.env` | — | 是 | — |
| `std.dom` | 是 | — | — |

“依赖宿主”表示目标 world 须包含相应接口。插件的 `std.log` 在宿主有日志接口时写入它，否则不执行输出。

<a id="103-portable-modules"></a>

### 10.3 便携模块

按名称导入模块。例如，使用 `import std.csv` 后即可调用 `csv.parse`。

| 模块 | API | 行为 |
|---|---|---|
| `std.bytes` | `Endian.Big`、`Endian.Little`、`pack_u16`、`pack_u32`、`pack_u64`、`Reader` | 读取器创建时复制输入。它提供 `read`、`read_u8`、指定字节序的整数读取以及 `skip`、`position` 和 `remaining`。读取或跳过失败时位置不变。 |
| `std.collections` | `Deque<T>`、`PriorityQueue<T>`、`count_by`、`group_by` | 双端队列两端的插入和移除具有摊还常数复杂度。优先队列以对数时间弹出最小值。分组保持组内的输入顺序。 |
| `std.csv` | `parse`、`stringify`、`Format.new` | 支持带引号的字段、双引号转义以及 LF、CRLF 或 CR 行尾，同一输入可有不同列数。`Format` 的分隔符可用制表符或双引号以外的可打印 ASCII 字符。写出时使用 CRLF，并将无字段行写成一个空字段。解析错误带从零开始的字节偏移。 |
| `std.date` | `Date`、`DateTime`、`days_in_month`、`is_leap_year` | 支持 0001 至 9999 年的公历。日期格式为 `YYYY-MM-DD`，可与自 1970-01-01 起的天数互转。时间戳格式为 `YYYY-MM-DDTHH:MM:SSZ`，可与 Unix 秒数互转。无效或越界值返回 `None`。 |
| `std.encoding` | `hex_encode`、`hex_decode`、`base64_encode`、`base64_decode`、`base64url_encode`、`base64url_decode`、`percent_encode`、`percent_decode` | 十六进制接受两种大小写并写出小写。Base64 使用标准填充，Base64url 使用 URL 安全字符且无填充。百分号编码保留 ASCII 字母、数字和 `-`、`.`、`_`、`~`，百分号解码保留原样的加号。解码返回字节或带字节偏移的错误。 |
| `std.fmt` | `join`、`int_radix`、`uint_radix`、`parse_int_radix`、`parse_uint_radix` | 通过 `Show` 拼接值。整数格式化和解析支持 2 至 36 进制。输出使用小写，解析接受两种大小写，有符号解析接受可选的正负号。无效输入和溢出返回 `None`。 |
| `std.iter` | `once`、`repeat`、`from_fn`、`unfold` | 从值、回调或状态转换创建惰性迭代器。`repeat` 生成无限序列。基于回调的序列遇到第一个 `None` 时结束。 |
| `std.json` | `parse`、`stringify`、`pretty`、`Json.at_pointer` | 支持紧凑输出和两空格缩进。指针用斜杠分段查找对象键和数组下标。`~0` 代表波浪号，`~1` 代表斜杠，空指针选中根值。指针无效或值缺失时返回 `None`。 |
| `std.path` | `is_absolute`、`normalize`、`join`、`parent`、`file_name`、`stem`、`extension` | 以文本规则处理斜杠分隔的路径。开头的斜杠表示根目录，`join` 的右侧为绝对路径时替换左侧。空相对路径规范化为 `.`。 |
| `std.stats` | `summarize`、`median` | 摘要包含计数、均值、极值、总体与样本方差及标准差。空样本、非有限值或摘要溢出返回 `None`。少于两个观测值时样本方差返回 `None`。 |
| `std.text` | `strip_prefix`、`strip_suffix`、`truncate`、`pad_start`、`pad_end` | 截断长度和填充宽度按 Unicode 标量计数。前后缀精确匹配。 |

```puddi
import std.collections
import std.csv

fn main() {
    let rows = csv.parse("fruit,red\nfruit,green\nvegetable,green").unwrap()
    let colors = collections.count_by(rows, |row| row[1])
    print(colors["green"])
}
```

## 11. 文法摘要

以下是非正式 EBNF。`sep` 表示 2.5 允许的换行、`;` 或 `,`。

```ebnf
file          = { import } { item } ;
import        = "import" mod_path [ "." "{" ident { "," ident } "}" ] [ "as" ident ]
              | "import" wit_name ;

item          = { attribute } [ "pub" | "export" ]
                ( fn_decl | struct_decl | enum_decl | trait_decl | impl_decl
                | type_alias | const_decl | test_decl ) ;
attribute     = "@" ident [ "(" [ attr_arg { "," attr_arg } ] ")" ] ;

fn_decl       = fn_sig [ block ] ;                       (* no block only with @extern *)
fn_sig        = [ "async" ] "fn" ident [ generics ] "(" [ params ] ")" [ "->" type ] ;
params        = param { "," param } [ "," ] ;
param         = "self" | ident ":" type ;
generics      = "<" gparam { "," gparam } ">" ;
gparam        = ident [ ":" bound { "+" bound } ] ;

struct_decl   = "struct" ident [ generics ] "{" { field sep } "}" ;
field         = [ "pub" ] [ "var" ] ident ":" type ;
enum_decl     = "enum" ident [ generics ] "{" { variant sep } "}" ;
variant       = ident [ "(" type { "," type } ")" | "{" { field sep } "}" ] ;
trait_decl    = "trait" ident [ generics ] [ ":" bound { "+" bound } ]
                "{" { ( "type" ident | fn_decl ) sep } "}" ;
impl_decl     = "impl" [ generics ] [ type_path "for" ] type
                "{" { ( fn_decl | "type" ident "=" type ) sep } "}" ;
type_alias    = "type" ident [ generics ] "=" type ;
const_decl    = "const" ident ":" type "=" expr ;
test_decl     = "test" string_lit block ;

type          = type_path | "dyn" type_path | "Self"
              | "(" [ type { "," type } ] ")"
              | [ "async" ] "fn" "(" [ type { "," type } ] ")" [ "->" type ] ;
type_path     = path [ "<" type_arg { "," type_arg } ">" ] ;
type_arg      = type | ident "=" type ;

block         = "{" { stmt sep } [ expr ] "}" ;
stmt          = ( "let" | "var" ) pattern [ ":" type ] "=" expr [ "else" block ]
              | expr ;

expr          = (* operators per 4.2 *) unary { binop unary } ;
unary         = { "-" | "!" } postfix ;
postfix       = primary { "." ident [ call_args ] | "." int_lit | call_args
                        | "[" expr "]" | "?" | ".await" } ;
call_args     = [ "<" type { "," type } ">" ] "(" [ expr { "," expr } [ "," ] ] ")" ;
primary       = literal | path | block | "(" expr ")" | tuple
              | list_lit | map_lit | struct_lit
              | if_expr | match_expr | loop_expr | while_expr | for_expr | closure
              | "return" [ expr ] | "break" [ expr ] | "continue" ;

if_expr       = "if" cond block [ "else" ( if_expr | block ) ] ;
cond          = expr | "let" pattern "=" expr ;
match_expr    = "match" expr "{" { pattern [ "if" expr ] "->" expr sep } "}" ;
loop_expr     = "loop" block ;
while_expr    = "while" cond block ;
for_expr      = "for" pattern "in" expr block ;
closure       = [ "async" ] "|" [ cparam { "," cparam } ] "|" [ "->" type ] expr ;
cparam        = pattern [ ":" type ] ;

list_lit      = "[" [ expr { "," expr } [ "," ] ] "]" ;
map_lit       = "[" ":" "]" | "[" expr ":" expr { "," expr ":" expr } [ "," ] "]" ;
struct_lit    = path "{" [ field_init { "," field_init } ] [ "," ".." expr ] "}" ;
field_init    = ident [ ":" expr ] ;

pattern       = pat_atom { "|" pat_atom } ;
pat_atom      = "_" | literal | literal ( ".." | "..=" ) literal | ident
              | path [ "(" [ pattern { "," pattern } ] ")"
                     | "{" [ fpat { "," fpat } ] [ "," ".." ] "}" ]
              | "(" [ pattern { "," pattern } ] ")"
              | "[" [ pattern { "," pattern } ] [ "," ".." ident ] "]" ;
fpat          = ident [ ":" pattern ] ;
```

## 12. 实现注记

本节不规定语言行为。

- 泛型经单态化处理
- 结构体映射到 WasmGC 结构体，`var` 字段可变，其余字段不可变
- 枚举以 WasmGC 基结构体表示，各变体是子类型。`match` 编译成 `br_on_cast` 链或标签分派
- 特征对象包含一对引用，分别指向虚表和数据
- 闭包结构体包含函数引用及捕获环境，捕获的 `var` 存在独立对象中
- 字符串可以在浏览器使用 JS String Builtins，在其他宿主使用 UTF-8 GC 数组
- 异步在浏览器基于 JSPI，在 WASI 0.3 基于原生异步
- 浏览器的每个工作线程对应一个运行独立实例的 Web Worker
- 溢出检查由原生运算、检测和陷阱组成

## 13. 示例

以下是规范中的说明性示例。可直接运行的实现见[内置 Todo 示例](../getting-started/examples.md)，其中手动将 JSON 值转换成结构体。

```puddi
// src/main.pud, built with: pud build --target wasi
import std.fs
import json

@derive(Eq, Show)
struct Todo {
    title: Str
    var done: Bool
}

enum AppErr {
    Io(fs.IoErr)
    Parse(json.ParseErr)
}

impl From<fs.IoErr> for AppErr {
    fn from(e: fs.IoErr) -> AppErr { AppErr.Io(e) }
}

impl From<json.ParseErr> for AppErr {
    fn from(e: json.ParseErr) -> AppErr { AppErr.Parse(e) }
}

fn load(path: Str) -> Result<List<Todo>, AppErr> {
    let text = fs.read(path)?
    let todos: List<Todo> = json.decode(text)?
    Ok(todos)
}

fn main() {
    let todos = match load("todos.json") {
        Ok(t) -> t
        Err(e) -> {
            print("could not load: {e}")
            return
        }
    }

    let pending = todos.filter(|t| !t.done)
    print("{pending.len()} of {todos.len()} left")

    for t in pending {
        print(" - {t.title}")
    }
}

test "empty list has nothing pending" {
    let todos: List<Todo> = []
    assert_eq(todos.filter(|t| !t.done).len(), 0)
}
```

## 14. 推迟到 v1 之后的功能

- 共享内存线程，等待 WasmGC 支持跨线程共享对象
- `where` 子句
- 常量泛型
- 自定义派生与编译期执行
