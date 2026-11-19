# Raw core-wasm

The Component Model is the main way to talk to hosts. For hosts that only understand plain core WebAssembly, `@extern` and `@export` declare raw imports and exports.

```puddi,ignore
@extern("env", "log")
fn log(msg: Str)

@export("run")
fn run() { log("hi") }
```

- `@extern(module, name)` declares a function without a body that the host provides as the core import `module.name`.
- `@export(name)` exports a function from the core module under `name`.
- Only numeric types and `Str` may cross the boundary. Anything else has to be marshaled by hand.

Prefer WIT imports and `export fn` whenever the host supports components: they carry full types and the compiler checks them.
