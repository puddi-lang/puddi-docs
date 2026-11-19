# Structs and enums

## Structs

```puddi
@derive(Show)
struct Point {
    x: Int
    var y: Int
}

fn main() {
    let p = Point { x: 1, y: 2 }
    p.y = 5
    let x = 10
    let y = 20
    let q = Point { x, y }
    let r = Point { x: 7, ..p }
    print("{p} {q} {r}")
}
```

```text,output
Point { x: 1, y: 5 } Point { x: 10, y: 20 } Point { x: 7, y: 5 }
```

- Fields are separated by newlines or commas.
- A field can be assigned after construction only if it is declared `var`. The others are fixed when the struct is built, which maps directly onto WasmGC immutable fields.
- `Point { x, y }` is shorthand for `Point { x: x, y: y }`, and `..p` copies the remaining fields from `p`.
- Fields are private to the module unless marked `pub`.

Assigning a field that is not `var` is a compile error:

```puddi,fail
struct Point {
    x: Int
    var y: Int
}

fn main() {
    let p = Point { x: 1, y: 2 }
    p.x = 5
}
```

Structs can be generic:

```puddi
struct Pair<A, B> { a: A, b: B }

fn main() {
    let p = Pair { a: 1, b: "one" }
    print("{p.a} {p.b}")
}
```

```text,output
1 one
```

## Enums

Enums are algebraic data types. A variant can be bare, tuple-like or record-like, and variants are named through the enum: `Shape.Circle`.

```puddi
enum Shape {
    Circle(Float)
    Rect { w: Float, h: Float }
    Empty
}

fn area(s: Shape) -> Float {
    match s {
        Shape.Circle(r) -> 3.14 * r * r
        Shape.Rect { w, h } -> w * h
        Shape.Empty -> 0.0
    }
}

fn main() {
    let shapes = [Shape.Circle(1.0), Shape.Rect { w: 2.0, h: 3.0 }, Shape.Empty]
    for s in shapes { print("{area(s)}") }
}
```

```text,output
3.14
6.0
0.0
```

`Option` and `Result` are ordinary enums. Their variants `Some`, `None`, `Ok` and `Err` are in the prelude and are written without a path.

## Tuples and unit

Tuples group values without naming them: `(Int, Str)`, built with `(1, "a")` and read with `.0`, `.1`. The unit type `()` has one value, also written `()`.

```puddi
fn min_max(xs: List<Int>) -> (Int, Int) {
    (xs.min().unwrap(), xs.max().unwrap())
}

fn main() {
    let t = min_max([4, 1, 7])
    let (lo, hi) = t
    print("{t.0} {t.1} {lo} {hi}")
}
```

```text,output
1 7 1 7
```

## Deriving traits

`@derive` generates implementations of built-in traits: `Eq`, `Ord`, `Hash`, `Show` and `Transfer`.

```puddi
@derive(Eq, Ord, Hash, Show)
struct Version { major: Int, minor: Int }

fn main() {
    let a = Version { major: 1, minor: 2 }
    let b = Version { major: 1, minor: 10 }
    print("{a < b} {a == b} {[b, a].sorted()}")
    let seen = Set.from([a, b, a])
    print("{seen.len()}")
}
```

```text,output
true false [Version { major: 1, minor: 2 }, Version { major: 1, minor: 10 }]
2
```

`Ord` compares fields in declaration order. `Transfer` lets a value be sent to a [worker](workers.md).

## Type aliases

```puddi
type UserId = Int
type Callback<T> = fn(T) -> ()

fn notify(id: UserId, cb: Callback<UserId>) { cb(id) }

fn main() {
    notify(7, |id| print("user {id}"))
}
```

```text,output
user 7
```

An alias is another name for the same type, not a new type.
