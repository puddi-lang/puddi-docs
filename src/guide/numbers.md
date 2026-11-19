# Numbers

| Type | Meaning |
|---|---|
| `Int` | 32-bit signed integer, the same type as `I32` |
| `I8` `I16` `I32` `I64` | signed integers |
| `U8` `U16` `U32` `U64` | unsigned integers |
| `Float` | 64-bit float, the same type as `F64` |
| `F32` `F64` | floats |

Integer literals default to `Int` and float literals to `Float`, unless the context asks for another type. Literals can use `_` as a separator and `0x`, `0b` and `0o` prefixes. A literal that does not fit its type is a compile error.

```puddi
fn main() {
    let a = 1_000
    let mask: U8 = 0xFF
    let big: I64 = 3_000_000_000
    let f = 2.5e-3
    print("{a} {mask} {big} {f}")
}
```

```text,output
1000 255 3000000000 0.0025
```

## Overflow and division

Integer overflow is not silent: it traps (see [panics](errors.md#panics)). So does integer division or remainder by zero. `/` on integers truncates toward zero, and `%` takes the sign of the dividend.

```puddi
fn main() {
    print("{-7 / 2} {-7 % 2}")
    let x: U8 = 250
    print("{x.wrapping_add(10)} {x.saturating_add(10)} {x.checked_add(10)}")
}
```

```text,output
-3 -1
4 255 None
```

`wrapping_*`, `saturating_*` and `checked_*` methods exist for the arithmetic operators when you want a different behavior.

## Widening is implicit

A conversion that can never lose information happens on its own, wherever the expected type is known: in annotated bindings, arguments, return values, fields and collection elements.

```puddi
fn average(total: Float, n: Float) -> Float { total / n }

fn main() {
    let n: Int = 4
    let wide: I64 = n
    let small: U8 = 200
    print("{average(10, n)} {wide + 1} {small + n}")
}
```

```text,output
2.5 5 204
```

For a binary operator with two different numeric types, both sides widen to the narrowest type that holds both. `U8 + Int` is `Int`. When no such type exists, as for `I64` and `U64` or `I64` and `Float`, it is a compile error. `I64` and `U64` never widen to a float, since `F64` cannot represent every 64-bit integer.

| From | Widens to |
|---|---|
| `I8` | `I16` `I32` `I64` `F32` `F64` |
| `I16` | `I32` `I64` `F32` `F64` |
| `I32` | `I64` `F64` |
| `U8` | `U16` `U32` `U64` `I16` `I32` `I64` `F32` `F64` |
| `U16` | `U32` `U64` `I32` `I64` `F32` `F64` |
| `U32` | `U64` `I64` `F64` |
| `F32` | `F64` |

## Narrowing is explicit

A conversion that might lose information is always a method call. `to_<type>()` returns an `Option` that is `None` when the value does not fit; methods such as `truncate_to_int()` and `round_to_int()` say how they lose information.

```puddi
fn main() {
    let big: I64 = 5_000_000_000
    let fits: I64 = 42
    print("{big.to_int()} {fits.to_int()}")
    print("{3.7.truncate_to_int()} {3.7.round_to_int()}")
}
```

```text,output
None Some(42)
3 4
```

## Floats

Floats have the usual methods: `sqrt`, `pow`, `abs`, `floor`, `ceil`, `round`, `sin`, `cos`, `ln` and more, and [std.math](../stdlib/math-log.md) has the same as functions plus constants such as `math.PI`. Floats print with the shortest digits that read back as the same value, and a float with no fractional part keeps its `.0`.

```puddi
fn main() {
    let x = 2.0
    print("{x.sqrt()} {0.1 + 0.2} {x.pow(10.0)}")
}
```

```text,output
1.4142135623730951 0.30000000000000004 1024.0
```

## Parsing

```puddi
fn main() {
    print("{"42".parse_int()} {"x".parse_int()} {"1.5".parse_float()}")
}
```

```text,output
Some(42) None Some(1.5)
```
