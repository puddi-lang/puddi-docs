# std.math and std.log

## std.math

Constants and functions on `Float`, plus integer helpers. Available on every target.

| Item | Meaning |
|---|---|
| `PI`, `E`, `TAU` | constants |
| `sqrt` `cbrt` `pow` `exp` `ln` `log2` `log10` | powers and logarithms |
| `sin` `cos` `tan` `asin` `acos` `atan` `atan2` `hypot` | trigonometry |
| `floor` `ceil` `round` `abs` | rounding |
| `gcd(a, b)`, `lcm(a, b)` | greatest common divisor and least common multiple of `Int`s |

The `Float` functions are also methods: `math.sqrt(x)` is `x.sqrt()`.

```puddi
import std.math

fn main() {
    let r = 2.0
    print("{math.PI * r * r}")
    print("{math.hypot(3.0, 4.0)} {math.gcd(12, 18)} {math.lcm(4, 6)}")
}
```

```text,output
12.566370614359172
5.0 6 12
```

## std.log

Leveled logging: `debug`, `info`, `warn` and `error`, each taking a `Str`. Messages go to standard error on `wasi`, to the console in browsers, and to `wasi:logging/logging` on `plugin` when the world imports it (otherwise they are dropped).

```puddi
import std.log

fn main() {
    log.info("starting")
    log.warn("disk almost full")
}
```
