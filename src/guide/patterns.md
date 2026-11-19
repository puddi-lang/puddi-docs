# Pattern matching

Patterns destructure values. They appear in `match`, `let`, `var`, `for`, `if let`, `while let` and `let ... else`.

| Pattern | Example |
|---|---|
| Wildcard | `_` |
| Binding | `x` |
| Literal | `42`, `"hi"`, `'a'`, `true` |
| Range | `1..=9`, `'a'..='z'` |
| Tuple | `(a, _, c)` |
| Struct | `Point { x, y: 0 }`, `Point { x, .. }` |
| Enum variant | `Some(v)`, `Shape.Rect { w, h }` |
| Or | `A \| B` |
| List | `[first, ..rest]`, `[]` |

## `match`

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

An arm can have an `if` guard. The compiler checks that the arms cover every value; a missing case is an error that names an example of what is not covered:

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

## Literals, ranges and or-patterns

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

## Lists

List patterns match on length and bind the rest of the list with `..name`:

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

## Destructuring bindings

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

## `if let`, `while let` and `let ... else`

`if let` runs a block when one pattern matches. `let ... else` binds the pattern or runs an `else` block that must leave the current scope (`return`, `break`, `continue` or `panic`):

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
