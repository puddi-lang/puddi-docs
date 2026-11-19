# Control flow

## `if`

`if` is an expression. Both branches must have the same type when the value is used; an `if` without `else` has type `()`.

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

## `match`

`match` compares a value against patterns, top to bottom, and must cover every possible value. Arms are written `pattern -> expression`.

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

Patterns are covered in detail in [Pattern matching](patterns.md).

## Loops

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

`for x in e` works for anything that implements `Iterable`: ranges, lists, maps, sets and iterators. `for` and `while` have type `()`.

`loop` repeats until `break`, and `break` can carry a value out as the value of the `loop`:

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

## Struct literals in conditions

In the condition of `if`, `while` and `match` (and the iterated expression of `for`), a struct literal must be wrapped in parentheses, so that its `{` is not mistaken for the start of the body:

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

## Early exit

`return` leaves a function with a value. `break` and `continue` work in all loops. Each of them, like `panic`, has a type that fits anywhere, so they can appear in any branch:

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
