# Compiler development

Puddi compiles source and WIT bindings to WebAssembly. The [compiler architecture](https://github.com/puddi-lang/puddi/blob/main/docs/architecture.md) describes the current main branch in detail.

| Stage | What it does | Starting point |
|---|---|---|
| Sources | Discovers modules, loads dependencies and generates WIT bindings | `src/main.rs`, `src/deps.rs`, `src/wit.rs` |
| Front end | Lexes and parses source, expands derives and resolves names | `src/lexer.rs`, `src/parser.rs`, `src/derive.rs`, `src/program.rs` |
| Elaboration | Checks types and patterns, monomorphizes generics and lowers to typed IR | `src/elab.rs`, `src/exhaust.rs`, `src/ir.rs` |
| WebAssembly | Lowers WasmGC types and instructions, encodes the module and wraps it as a component | `src/codegen.rs`, `src/wit.rs` |
| Hosting | Runs the component in Wasmtime or extracts the core module for a JavaScript host | `src/runner.rs`, `src/runtime.mjs` |

## Optimization and diagnostics

Puddi v0.1.1 includes an IR optimization pass, a built-in WebAssembly assembler, parallel parsing and code generation, and caches for builds and Wasmtime machine code. See the [v0.1.1 release notes](https://github.com/puddi-lang/puddi/releases/tag/v0.1.1) for details.

| Environment variable | What it does |
|---|---|
| `PUD_TIME=1` | Print elapsed time at compiler phases |
| `PUD_NO_CACHE=1` | Disable the build and Wasmtime caches |
| `PUD_NO_OPT=1` | Skip the IR optimizer |
| `PUD_WAT=1` | Use the `wat` crate instead of the built-in assembler |
| `PUD_ASM_CHECK=1` | Assemble with both implementations and compare their output |
| `PUD_SERIAL_CODEGEN=1` | Generate WebAssembly text on one thread |

## Finding the right test

Add a [conformance case](conformance.md#writing-cases) when a change affects a rule in the specification. Use the compiler repository’s `tests/run` for a runtime regression and `tests/fail` for a rejected program. The [contribution guide](https://github.com/puddi-lang/puddi/blob/main/CONTRIBUTING.md) explains the fixture formats.
