# 特征与泛型

## 特征

特征描述类型能够实现的一组方法。Puddi 使用名义特征，类型必须通过显式的 `impl` 块声明实现。

```puddi
trait Shape {
    fn area(self) -> Float
    fn name(self) -> Str { "shape" }
}

struct Square { side: Float }
struct Circle { r: Float }

impl Shape for Square {
    fn area(self) -> Float { self.side * self.side }
    fn name(self) -> Str { "square" }
}

impl Shape for Circle {
    fn area(self) -> Float { 3.0 * self.r * self.r }
}

fn main() {
    let s = Square { side: 2.0 }
    let c = Circle { r: 1.0 }
    print("{s.name()} {s.area()}")
    print("{c.name()} {c.area()}")
}
```

```text,output
square 4.0
shape 3.0
```

特征中带方法体的是默认实现。`impl` 可以覆盖它。

## 类型约束

泛型函数通过类型约束说明所需能力，多个约束用 `+` 连接。

```puddi
fn describe<T: Show + Eq>(a: T, b: T) -> Str {
    if a == b { "{a} twice" } else { "{a} and {b}" }
}

fn main() {
    print(describe(1, 1))
    print(describe("x", "y"))
}
```

```text,output
1 twice
x and y
```

泛型会单态化。编译器为每组实际类型生成对应的代码。

## 实现标准特征

`Show` 控制字符串插值时如何显示值。若 `@derive(Show)` 生成的行为不合适，可手写实现。

```puddi
struct Money { cents: Int }

impl Show for Money {
    fn show(self) -> Str {
        let rest = self.cents % 100
        let pad = if rest < 10 { "0" } else { "" }
        "${self.cents / 100}.{pad}{rest}"
    }
}

fn main() {
    print("total: {Money { cents: 1205 }}")
}
```

```text,output
total: $12.05
```

## 运算符对应的特征

实现对应特征后，就可以在该类型上使用运算符。

| 运算符 | 特征 |
|---|---|
| `+` `-` `*` `/` `%` | `Add` `Sub` `Mul` `Div` `Rem` |
| 一元 `-` `!` | `Neg` `Not` |
| `==` `!=` | `Eq` |
| `<` `<=` `>` `>=` | `Ord` |
| `a[i]` | `Index` |
| `for x in a` | `Iterable` |
| `"{a}"` | `Show` |

```puddi
@derive(Show)
struct V2 { x: Int, y: Int }

impl Add for V2 {
    fn add(self, other: V2) -> V2 { V2 { x: self.x + other.x, y: self.y + other.y } }
}

fn main() {
    print("{V2 { x: 1, y: 2 } + V2 { x: 10, y: 20 }}")
}
```

```text,output
V2 { x: 11, y: 22 }
```

## 关联类型与父特征

特征可以声明关联类型，用 `Self.Name` 引用。也可以要求实现者同时实现其他特征。

```puddi
trait Container {
    type Item
    fn items(self) -> List<Self.Item>
}

trait Named: Show {
    fn title(self) -> Str { "<{self.show()}>" }
}

struct Bag { xs: List<Int> }

impl Container for Bag {
    type Item = Int
    fn items(self) -> List<Int> { self.xs }
}

impl Show for Bag {
    fn show(self) -> Str { "bag of {self.xs.len()}" }
}

impl Named for Bag {}

fn main() {
    let b = Bag { xs: [1, 2] }
    print("{b.items()} {b.title()}")
}
```

```text,output
[1, 2] <bag of 2>
```

## 泛型实现与一致性

`impl` 可以带类型参数及约束。

```puddi
trait Describe {
    fn describe(self) -> Str
}

impl<T: Show> Describe for List<T> {
    fn describe(self) -> Str { "{self.len()} items: {self}" }
}

fn main() {
    print([1, 2, 3].describe())
}
```

```text,output
3 items: [1, 2, 3]
```

`impl Trait for Type` 须写在定义特征或定义类型的包中。对固定的类型和特征，最多有一个适用的实现。请留意[已知差异](../reference/conformance.md#known-gaps-in-01)。

## 特征对象

`dyn Trait` 可持有任意实现了该特征的值。运行时通过虚表分派调用，因此同一个列表可以容纳不同具体类型。

```puddi
fn main() {
    let items: List<dyn Show> = [1, "two", 3.5, [4]]
    for it in items { print(it.show()) }
}
```

```text,output
1
two
3.5
[4]
```

当上下文要求 `dyn Trait` 时，具体值可隐式转换。作为特征对象使用的方法不能有自己的类型参数，也不能在接收者之外使用 `Self`。关联类型必须确定，例如 `dyn Iterator<Item = Int>`。
