# 控制流

## if

`if` 是表达式。使用结果时，两条分支必须有相同类型。没有 `else` 时，`if` 的类型是 `()`。

```puddi
fn sign(x: Int) -> Int {
    if x > 0 { 1 } else if x < 0 { -1 } else { 0 }
}

fn main() {
    print("{sign(-4)} {sign(0)} {sign(9)}")
}
```

```text,output
-1 0 1
```

## match

`match` 从上至下匹配模式，必须覆盖所有可能的值。匹配分支写作 `pattern -> expression`。

```puddi
fn label(code: Int) -> Str {
    match code {
        200 -> "ok"
        404 -> "not found"
        500..=599 -> "server error"
        _ -> "other"
    }
}

fn main() {
    print("{label(200)} {label(503)} {label(302)}")
}
```

```text,output
ok server error other
```

详见[模式匹配](patterns.md)。

## 循环

```puddi
fn main() {
    for i in 0..3 { print("for {i}") }

    var n = 3
    while n > 0 {
        n -= 1
        if n == 1 { continue }
        print("while {n}")
    }

    let stack = [1, 2, 3]
    while let Some(top) = stack.pop() {
        print("popped {top}")
    }
}
```

```text,output
for 0
for 1
for 2
while 2
while 0
popped 3
popped 2
popped 1
```

`for x in e` 可以遍历任何实现了 `Iterable` 的值，包括区间、列表、映射、集合和迭代器。`for` 与 `while` 的类型都是 `()`。

`loop` 重复运行直到 `break`。`break` 后面的值可作为整个 `loop` 的结果：

```puddi
fn main() {
    var x = 1
    let first_big = loop {
        x *= 3
        if x > 100 { break x }
    }
    print("{first_big}")
}
```

```text,output
243
```

## 条件里的结构体字面量

在 `if`、`while`、`match` 的条件或 `for` 的被遍历表达式中，给结构体字面量加括号，避免编译器把它的 `{` 当成主体代码块的起点。

```puddi
struct Point { x: Int, y: Int }

fn main() {
    let p = Point { x: 1, y: 2 }
    if same(p, p) && (Point { x: 1, y: 2 }).x == p.x {
        print("same x")
    }
}
```

```text,output
same x
```

## 提前退出

`return` 携带返回值离开函数。`break` 和 `continue` 可用于各种循环。它们与 `panic` 一样可出现在任意类型的分支中，因为执行到这里就不会继续求值。

```puddi
fn first_negative(xs: List<Int>) -> Option<Int> {
    for x in xs {
        if x < 0 { return Some(x) }
    }
    None
}

fn main() {
    print("{first_negative([3, -1, -5])} {first_negative([1])}")
}
```

```text,output
Some(-1) None
```
