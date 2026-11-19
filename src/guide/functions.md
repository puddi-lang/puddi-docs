# Functions and closures

## Functions

Parameters and the return type of a top-level function are always written out. A missing return type means `()`. The last expression of the body is the return value; `return` exits early.

```puddi
fn area(w: Int, h: Int) -> Int {
    let s = w * h
    s
}

fn report(name: Str, value: Int) {
    print("{name}: {value}")
}

fn main() {
    report("area", area(3, 4))
}
```

```text,output
area: 12
```

## Methods

Methods are declared in an `impl` block and take `self` as the first parameter. Functions in an `impl` block without `self` are associated functions, called through the type name. `.` is the only path separator: there is no `::`.

```puddi
struct Counter {
    var count: Int
}

impl Counter {
    fn new() -> Counter { Counter { count: 0 } }
    fn bump(self, by: Int) { self.count += by }
    fn get(self) -> Int { self.count }
}

fn main() {
    let c = Counter.new()
    c.bump(2)
    c.bump(3)
    print("{c.get()}")
}
```

```text,output
5
```

There is no separate mutable receiver: values are references, so a method changes the object by assigning its `var` fields.

## Closures

Closures are written `|params| body`. Parameter types can usually be inferred from where the closure is used; annotate them when the closure is stored before it is used.

```puddi
fn apply_twice(f: fn(Int) -> Int, x: Int) -> Int {
    f(f(x))
}

fn main() {
    let add = |a: Int, b: Int| -> Int { a + b }
    print("{add(2, 3)}")
    print("{apply_twice(|x| x * 10, 3)}")
    print("{[1, 2, 3].map(|x| x + 1)}")
}
```

```text,output
5
300
[2, 3, 4]
```

Function types are written `fn(A, B) -> R`. Named functions and closures both convert to them:

```puddi
fn double(x: Int) -> Int { x * 2 }

fn main() {
    let ops: List<fn(Int) -> Int> = [double, |x: Int| x + 1]
    for op in ops { print("{op(10)}") }
}
```

```text,output
20
11
```

Closures capture variables by reference. A closure that captures a `var` sees later assignments to it, and can make them:

```puddi
fn main() {
    var total = 0
    let add = |x: Int| { total += x }
    add(5)
    add(7)
    print("{total}")
}
```

```text,output
12
```

## Generic functions

Type parameters go in angle brackets, with bounds after `:`. They are usually inferred at the call site, and can be written explicitly:

```puddi
fn largest<T: Ord>(xs: List<T>) -> Option<T> {
    var best: Option<T> = None
    for x in xs {
        best = match best {
            Some(b) if b >= x -> Some(b)
            _ -> Some(x)
        }
    }
    best
}

fn main() {
    print("{largest([3, 9, 2])} {largest(["b", "a"])} {largest<Int>([])}")
}
```

```text,output
Some(9) Some("b") None
```

See [Traits and generics](traits.md) for bounds and traits.
