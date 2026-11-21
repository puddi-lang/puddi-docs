# WIT imports

The Component Model describes host interfaces in WIT. Importing an interface by its WIT name generates typed Puddi bindings for it and adds it to the component's world:

```puddi
import wasi:clocks/system-clock as clock

fn main() {
    let now = clock.now()
    print("{now.seconds > 0}")
}
```

```text,output
true
```

The `pud` toolchain bundles the WASI 0.3 interfaces (`wasi:cli`, `wasi:clocks`, `wasi:filesystem`, `wasi:http`, `wasi:logging`, `wasi:random`, `wasi:sockets`) and `puddi:runtime`. Interfaces from WIT files in the package's own `wit/` directory can be imported the same way.

## Type mapping

| WIT | Puddi |
|---|---|
| `bool` | `Bool` |
| `s8` `s16` `s32` `s64` | `I8` `I16` `I32` `I64` |
| `u8` `u16` `u32` `u64` | `U8` `U16` `U32` `U64` |
| `f32` `f64` | `F32` `F64` |
| `char` | `Char` |
| `string` | `Str` |
| `list<T>` | `List<T>` |
| `option<T>` | `Option<T>` |
| `result<T, E>` | `Result<T, E>` |
| `tuple<...>` | tuple |
| `record` | `struct` |
| `variant`, `enum` | `enum` |
| `flags` | a generated struct of `Bool` fields |
| `resource` | a handle struct with methods and `drop()` |

Names are converted to Puddi conventions: a WIT record `entry` becomes the struct `Entry`, the enum case `info` becomes the variant `Level.Info`, and functions and fields keep `snake_case`. Types are reached through the interface's import name, as in `log.Entry`.

## How bindings work

The bindings, including the canonical ABI lowering and lifting of every value, are generated as Puddi code and compiled with the rest of the program, so there is no separate binding generator to run. `pud check` type-checks calls into WIT interfaces like any other call.

## Exports

`export fn` declares a function that the component exports. On the `plugin` target the exports must match the host's world; on `wasi`, exports are used with worlds other than `wasi:cli/command`. See [Plugins](plugins.md).

The world can use records, variants, enums and flags from an interface in its export signatures.

## Limits

- `pud test` runs on the JavaScript host, so tests cannot call WIT imports.
- `pud run` on the `plugin` target provides the WASI interfaces listed in [Plugins](plugins.md#host-capabilities); calls to other host imports trap.
