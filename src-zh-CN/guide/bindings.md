# 绑定与值

## let 与 var

`let` 声明不可重新赋值的绑定，`var` 声明可以重新赋值的绑定。

```puddi
fn main() {
    let greeting = "hello"
    var count = 0
    count += 1
    count = count * 10
    print("{greeting} {count}")
}
```

```text,output
hello 10
```

局部绑定的类型通常由编译器推断。需要注明类型或缺少推断依据时，把类型写在名称后面：

```puddi
fn main() {
    let ratio: Float = 1
    let names: List<Str> = []
    print("{ratio} {names}")
}
```

```text,output
1.0 []
```

给 `let` 绑定重新赋值会导致编译错误：

```puddi,fail
fn main() {
    let total = 1
    total = 2
}
```

## 引用值

结构体、枚举和集合是引用值。赋值或传参共享同一个对象，操作不会复制对象。

```puddi
fn main() {
    let a = [1, 2]
    let b = a
    b.push(3)
    print("{a}")
    print("{same(a, b)}")
}
```

```text,output
[1, 2, 3]
true
```

`let` 固定的是绑定本身。对象能否修改由类型决定，例如 `List` 可以增删元素，结构体只有声明为 `var` 的字段才允许重新赋值。详见[结构体与枚举](structs-enums.md)。

`==` 通过 `Eq` 比较值。`same(a, b)` 判断两个引用是否指向同一个对象。

## 表达式

块、`if`、`match` 和 `loop` 都是表达式。块末尾的表达式给出块的值。

```puddi
fn main() {
    let x = 7
    let size = {
        let doubled = x * 2
        if doubled > 10 { "big" } else { "small" }
    }
    print(size)
}
```

```text,output
big
```

## 换行与语句

换行通常结束语句，也可以用 `;` 在同一行分隔语句。行尾是二元运算符或逗号、`(` 或 `[` 尚未匹配，或者下一行从 `.` 开始时，表达式会续到下一行。

```puddi
fn main() {
    let price = 3
    let count = 4
    let total = price * count +
        2
    let words = ["a", "bb", "ccc"]
        .map(|w| w.to_upper())
    print("{total} {words}"); print("done")
}
```

```text,output
14 ["A", "BB", "CCC"]
done
```

## 注释

```puddi,ignore
// a line comment
/* a block comment /* which may nest */ */
/// a doc comment, attached to the next declaration and read by `pud doc`
```

## 命名

类型、特征和枚举变体使用 `UpperCamelCase`，函数、变量、字段和模块使用 `snake_case`，常量使用 `SCREAMING_SNAKE_CASE`。

```puddi
const MAX_RETRIES: Int = 3

fn main() {
    print("up to {MAX_RETRIES} retries")
}
```

```text,output
up to 3 retries
```

常量初始化必须是常量表达式，例如字面量、其他常量、对它们进行算术或比较，以及结构体、元组和枚举构造。
