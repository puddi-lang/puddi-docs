# Targets

Every target is built from the same source language. `@target(...)` keeps a declaration only for some targets, and importing a standard module that a target does not provide is a compile error (see [Modules by target](../stdlib/modules.md)).

| Target | Output | Entry point |
|---|---|---|
| `wasi` (default) | a WASI 0.3 component for the world in `[target.wasi]`, default `wasi:cli/command` | `fn main()` or `async fn main()`; `export fn` for other worlds |
| `browser` | a component plus a JavaScript loader, `puddi.mjs` | `fn main()`, `async fn main()` and `export fn` |
| `plugin` | a component for the host world in `[target.plugin]` | the exports the world requires |

## `wasi`

The output is a component of the `wasi:cli/command@0.3.2` world, or the world named in `[target.wasi]`. The runtime talks to WASI directly:

- standard input and output go through WASI streams, and files through `wasi:filesystem` preopens;
- time and randomness come from `wasi:clocks` and `wasi:random`;
- `std.http` uses `wasi:http/client`;
- `run` is lifted with the async ABI and every spawned task runs on its own Component Model thread, so a blocking WASI call suspends only its task.

There is no WASI 0.2 output.

`pud run` runs the component in the Wasmtime runtime embedded in `pud`. To run it elsewhere you need a host with WASI 0.3, component-model async and threading, GC and exceptions enabled. A program that uses workers also needs the `puddi:runtime` worker interfaces, which the embedded runner provides.

`pud` built with `--no-default-features` has no embedded runtime; `pud run` then needs such an external host, or `PUD_HOST=node`.

## `browser`

`pud build --target browser` writes the component and `puddi.mjs`, and `pud run --target browser` serves them with a page on `http://127.0.0.1:8000`. Browsers cannot instantiate components yet, so the loader does what `jco transpile` does: it takes the core module out of the component and instantiates it with the host functions the component imports. The page needs a browser with WebAssembly GC, and JSPI for async code. See [The browser](../interop/browser.md).

## `plugin`

A plugin is a component for a world defined by its host, such as an editor, a game or a server that loads extensions. The world is set in the manifest:

```toml
[target.plugin]
world = "wit/host.wit#plugin"
```

`export fn` items implement the world's exports, and the compiler checks that every required export exists with a matching signature. See [Plugins](../interop/plugins.md).

## Output format

All targets use WasmGC: structs and enums are GC structs, generics are monomorphized, and closures and trait objects are GC structs holding function references. Components are encoded with `wit-component`.
