# 模式匹配

模式用于拆解值，可以写在 `match`、`let`、`var`、`for`、`if let`、`while let` 和 `let ... else` 中。

| 模式 | 示例 |
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

## match

```puddi
enum Shape {
    Circle(Float)
    Rect { w: Float, h: Float }
    Empty
}

fn describe(s: Shape) -> Str {
    match s {
        Shape.Circle(r) if r > 10.0 -> "big circle"
        Shape.Circle(_) -> "circle"
        Shape.Rect { w, h } if w == h -> "square {w}"
        Shape.Rect { w, h } -> "rect {w}x{h}"
        Shape.Empty -> "nothing"
    }
}

fn main() {
    print(describe(Shape.Circle(20.0)))
    print(describe(Shape.Rect { w: 2.0, h: 2.0 }))
    print(describe(Shape.Rect { w: 2.0, h: 3.0 }))
}
```

```text,output
big circle
square 2.0
rect 2.0x3.0
```

分支可附加 `if` 守卫。编译器会检查穷尽性。如果有值无法匹配，诊断会举出未覆盖的取值。

```puddi,fail
enum Light { Red, Yellow, Green }

fn next(l: Light) -> Light {
    match l {
        Light.Red -> Light.Green
        Light.Green -> Light.Yellow
    }
}

fn main() {}
```

## 字面量 区间与或模式

```puddi
fn kind(c: Char) -> Str {
    match c {
        'a' | 'e' | 'i' | 'o' | 'u' -> "vowel"
        'a'..='z' -> "consonant"
        '0'..='9' -> "digit"
        _ -> "other"
    }
}

fn main() {
    print("{kind('e')} {kind('k')} {kind('4')} {kind('?')}")
}
```

```text,output
vowel consonant digit other
```

## 列表

列表模式匹配长度，并可以用 `..name` 绑定剩余部分。

```puddi
fn summary(xs: List<Int>) -> Str {
    match xs {
        [] -> "empty"
        [x] -> "just {x}"
        [first, ..rest] -> "{first} and {rest.len()} more"
    }
}

fn main() {
    print(summary([]))
    print(summary([5]))
    print(summary([1, 2, 3]))
}
```

```text,output
empty
just 5
1 and 2 more
```

## 解构绑定

```puddi
struct Point { x: Int, y: Int }

fn main() {
    let (a, b) = (1, "two")
    let Point { x, .. } = Point { x: 3, y: 4 }
    for (i, name) in ["ann", "bo"].enumerate() {
        print("{i} {name}")
    }
    print("{a} {b} {x}")
}
```

```text,output
0 ann
1 bo
1 two 3
```

## if let、while let 与 let else

`if let` 在模式匹配时执行代码块。`while let` 在每一轮重新匹配。`let ... else` 绑定匹配结果，否则执行 `else` 块，该块必须用 `return`、`break`、`continue` 或 `panic` 离开当前控制流。

```puddi
fn parse_pair(s: Str) -> Option<(Int, Int)> {
    let Some((a, b)) = s.split_once(",") else {
        return None
    }
    let Some(x) = a.trim().parse_int() else { return None }
    let Some(y) = b.trim().parse_int() else { return None }
    Some((x, y))
}

fn main() {
    if let Some((x, y)) = parse_pair("3, 4") {
        print("{x + y}")
    }
    print("{parse_pair("nope")}")
}
```

```text,output
7
None
```
