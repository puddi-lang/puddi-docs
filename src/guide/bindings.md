# Bindings and values

## `let` and `var`

`let` declares a binding that cannot be reassigned. `var` declares one that can.

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

Types of local bindings are inferred. Write a type after the name when you want to state it or when there is nothing to infer it from:

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

Assigning to a `let` binding is a compile error:

```puddi,fail
fn main() {
    let total = 1
    total = 2
}
```

## Values are references

Structs, enums and collections are reference values. Assigning one or passing it to a function shares the same object; nothing is copied.

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

`let` only stops the *binding* from changing. Whether the object itself can change is decided by its type: a `List` can grow, and a struct field can be assigned only if it is declared `var` (see [Structs and enums](structs-enums.md)).

`==` compares values through the `Eq` trait; `same(a, b)` checks whether two references point to the same object.

## Expressions everywhere

Blocks, `if`, `match` and `loop` are expressions. The last expression in a block is its value:

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

## Statements and lines

A newline ends a statement, and `;` can separate statements on one line. A line continues onto the next when it ends with a binary operator or a comma, when a `(` or `[` is still open, or when the next line starts with `.`:

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

## Comments

```puddi,ignore
// a line comment
/* a block comment /* which may nest */ */
/// a doc comment, attached to the next declaration and read by `pud doc`
```

## Naming

Types, traits and enum variants are `UpperCamelCase`. Functions, variables, fields and modules are `snake_case`. Constants are `SCREAMING_SNAKE_CASE`:

```puddi
const MAX_RETRIES: Int = 3

fn main() {
    print("up to {MAX_RETRIES} retries")
}
```

```text,output
up to 3 retries
```

A constant's initializer must be a constant expression: literals, other constants, arithmetic and comparisons on them, and struct, tuple and enum construction.
