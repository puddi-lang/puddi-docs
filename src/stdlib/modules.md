# Modules by target

Standard modules are imported with `import std.<name>`. A module the build target does not provide is a compile error to import.

| Module | Purpose | browser | wasi | plugin |
|---|---|---|---|---|
| [`std.json`](json.md) | JSON values, parsing and output | yes | yes | yes |
| [`std.log`](math-log.md#stdlog) | leveled logging | yes | yes | yes |
| [`std.math`](math-log.md#stdmath) | constants and functions | yes | yes | yes |
| `std.bytes` | byte-order conversions and bounded binary reads | yes | yes | yes |
| `std.collections` | deques, priority queues, grouping and counting | yes | yes | yes |
| `std.csv` | delimited text with CSV quoting rules | yes | yes | yes |
| `std.date` | Gregorian dates, UTC timestamps and Unix epoch conversions | yes | yes | yes |
| `std.encoding` | hex, Base64, Base64url and percent encoding | yes | yes | yes |
| `std.fmt` | value formatting and integer base conversion | yes | yes | yes |
| `std.iter` | lazy iterator sources | yes | yes | yes |
| `std.path` | lexical operations on slash-separated paths | yes | yes | yes |
| `std.stats` | summaries, variance, standard deviation and median | yes | yes | yes |
| `std.text` | Unicode scalar based truncation and padding, prefix and suffix removal | yes | yes | yes |
| [`std.time`](time-random.md#stdtime) | clocks, sleeping | yes | yes | host |
| [`std.random`](time-random.md#stdrandom) | random numbers | yes | yes | host |
| [`std.http`](http.md) | HTTP client | yes | yes | host |
| [`std.worker`](../guide/workers.md) | parallel workers | yes | host | host |
| [`std.io`](system.md#stdio) | standard input and output | - | yes | - |
| [`std.fs`](system.md#stdfs) | files and directories | - | yes | - |
| [`std.env`](system.md#stdenv) | arguments, environment, exit | - | yes | - |
| [`std.dom`](dom.md) | the browser document | yes | - | - |

"host" means the module is available only when the target world includes the interfaces it needs; [Plugins](../interop/plugins.md#host-capabilities) lists them. On `wasi`, `std.worker` uses the `puddi:runtime` interfaces that `pud run` provides. On `plugin`, `std.log` writes to the host's logging interface if the world has one and does nothing otherwise.

See the [portable module API reference](../reference/spec.md#103-portable-modules) and the [standard library source](https://github.com/puddi-lang/puddi/tree/v0.1.2/std).
