# Plugins

The `plugin` target builds a component for a world that a host application defines. The host decides what the plugin can call (its imports) and what the plugin must provide (its exports).

## A plugin from start to finish

The host publishes a WIT world:

```wit
// wit/host.wit
package demo:host;

interface log {
  enum level { info, warn }
  record entry { level: level, message: string }
  write: func(e: entry);
}

world plugin {
  import log;
  export greet: func(name: string, times: u32) -> list<string>;
  export classify: func(n: s64) -> result<string, option<u8>>;
}
```

The plugin's manifest points at the world:

```toml
[package]
name = "greeter"
version = "0.1.0"
puddi = "0.1"

[target.plugin]
world = "wit/host.wit#plugin"
```

and `export fn` implements each export:

```puddi,ignore
// src/main.pud
import demo:host/log

export fn greet(name: Str, times: U32) -> List<Str> {
    log.write(log.Entry { level: log.Level.Info, message: "greeting {name}" })
    let out: List<Str> = []
    for i in 0..times.to_int().unwrap_or(0) {
        out.push("hi {name} {i}")
    }
    out
}

export fn classify(n: I64) -> Result<Str, Option<U8>> {
    if n > 0 { Ok("positive {n}") } else if n == 0 { Err(None) } else { Err(Some(7)) }
}
```

```sh
pud build --target plugin       # target/plugin/greeter.wasm
pud run --target plugin -- classify 5
```

```text
ok("positive 5")
```

A missing export, or one whose signature does not match the world, is a compile error. Use `export async fn` for an `async func` export; it may spawn tasks and await.

## Host capabilities

A plugin gets the standard modules its world provides:

| Module | Needs these imports in the world |
|---|---|
| `std.time` | `wasi:clocks/monotonic-clock`, `wasi:clocks/system-clock` |
| `std.random` | `wasi:random/random` |
| `std.http` | `wasi:http/types`, `wasi:http/client` |
| `std.worker` | `puddi:runtime/workers`, `puddi:runtime/port` |
| `std.log`, `print` | `wasi:logging/logging` (otherwise they do nothing) |

`pud run --target plugin -- <export> [args]` calls one export in the embedded runtime. The runtime provides the interfaces in the table above; other host imports, like `demo:host/log` here, trap when called, so test those code paths in the real host.

## Panics in plugins

A panic traps the plugin instance. The host sees the trap as an error from the call and keeps running.

The puddi repository has two complete examples: [examples/plugin](https://github.com/puddi-lang/puddi/tree/main/examples/plugin) and [examples/plugin-host](https://github.com/puddi-lang/puddi/tree/main/examples/plugin-host), which uses every host capability.
