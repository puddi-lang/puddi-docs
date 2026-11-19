# Traits and generics

## Traits

A trait is a set of methods that a type can implement. Traits are nominal: a type implements a trait only through an explicit `impl` block.

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

Methods with a body are default methods; an `impl` can override them.

## Bounds

A generic function states what it needs from its type parameters with bounds, combined with `+`:

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

Generic code is monomorphized: each instantiation is compiled separately, so generics have no runtime cost.

## Implementing standard traits

`Show` controls how a value appears in string interpolation. Implement it by hand when `@derive(Show)` is not what you want:

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

## Operator traits

Operators call trait methods, so implementing the trait gives a type the operator:

| Operator | Trait |
|---|---|
| `+` `-` `*` `/` `%` | `Add` `Sub` `Mul` `Div` `Rem` |
| unary `-` `!` | `Neg` `Not` |
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

## Associated types and supertraits

A trait can declare associated types, written `Self.Name`, and require other traits:

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

## Generic impls and coherence

An `impl` can itself be generic, with bounds:

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

An `impl Trait for Type` is allowed only in the package that defines the trait or the package that defines the type, and at most one impl may apply to a type.

## Trait objects

`dyn Trait` is a type for any value that implements the trait. Calls go through a vtable at runtime, so values of different types can live in one list:

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

A value converts to `dyn Trait` wherever that type is expected. A trait can be used this way only if none of its methods has its own type parameters or mentions `Self` outside the receiver, and associated types must be fixed, as in `dyn Iterator<Item = Int>`.
