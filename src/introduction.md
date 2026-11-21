# Introduction

Puddi is a statically typed, expression-oriented language that compiles to WebAssembly. One source language targets the browser, WASI runtimes (servers, edge functions, command-line tools) and plugin hosts. Programs use the WebAssembly engine's garbage collector (WasmGC) and talk to their host through the Component Model.

```puddi
@derive(Eq, Show)
struct Todo {
    title: Str
    var done: Bool
}

fn main() {
    let todos = [Todo { title: "spec", done: true }, Todo { title: "compiler", done: false }]
    let pending = todos.filter(|t| !t.done)
    print("{pending.len()} of {todos.len()} left")
}
```

```text,output
1 of 2 left
```

## At a glance

| Topic | Puddi |
|---|---|
| Output | WebAssembly only; JavaScript appears only as loader glue |
| Hosts | `browser`, `wasi` (WASI 0.3), `plugin` (any Component Model host) |
| Memory | WasmGC, no manual memory management |
| Types | static, with local type inference |
| Polymorphism | generics, nominal traits, `dyn Trait` |
| Missing values and errors | no null: `Option`, `Result`, `?`, `AnyErr`; panics trap |
| Mutability | `let` and `var` bindings, mutability declared per field |
| Numbers | `Int` is 32-bit and overflow traps; lossless widening is implicit |
| Concurrency | `async fn`, `.await`, structured task scopes, isolated workers |
| Toolchain | one `pud` command, a `pud.toml` manifest, git-based packages |

## How this book is organized

- **[Getting started](getting-started/installation.md)** installs `pud` and walks through a first program and a first package.
- **[Language guide](guide/bindings.md)** introduces the language one topic at a time. Every complete example in it is compiled, and the ones with output are run, against the released toolchain.
- **[Toolchain](toolchain/pud.md)** and **[Host interop](interop/wit.md)** cover building for each target and talking to hosts.
- **[Standard library](stdlib/prelude.md)** lists the prelude and the `std` modules.
- **[Reference](reference/spec.md)** holds the language specification, which is the normative definition of Puddi, and the conformance suite that checks the toolchain against it.

This book documents Puddi 0.1, the first release. The language is a draft and may still change between 0.x releases; the [changelog](reference/changelog.md) records what changed.

## Choose a path

| I want to | Start here |
|---|---|
| Run a command-line program | [Hello, Puddi](getting-started/hello.md) and the [bundled examples](getting-started/examples.md) |
| Put a program on a web page | [The browser](interop/browser.md) |
| Write a plugin for an existing host | [Plugins](interop/plugins.md) and [WIT imports](interop/wit.md) |
| Understand a compiler error | [Troubleshooting](toolchain/troubleshooting.md) and the [implementation status](reference/status.md) |
| Work on the compiler | [Compiler development](reference/compiler.md) and [contributing](community/contributing.md) |

## Getting help

- Questions and ideas: [Puddi Discussions](https://github.com/puddi-lang/puddi/discussions)
- Compiler and toolchain bugs: [Puddi issues](https://github.com/puddi-lang/puddi/issues)
- Mistakes in this book: [puddi-docs issues](https://github.com/puddi-lang/puddi-docs/issues), or the edit button at the top of each page
