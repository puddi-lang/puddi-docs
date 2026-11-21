# Implementation status

The [conformance suite](conformance.md) checks the `pud` compiler against the draft 0.1 language specification.

## Language

Structs, enums, tuples, generics with bounds (monomorphized), traits with default methods, associated types and supertraits, `dyn Trait`, operator traits, closures that capture by reference, pattern matching with exhaustiveness checking (guards, ranges, or-patterns, list patterns, `let ... else`, `if let`, `while let`), `?` with `From` conversion, `AnyErr` with `downcast`, `@derive(Eq, Ord, Hash, Show, Transfer)`, constants, type aliases, `async fn` and `.await`, `task.scope` with structured cancellation, workers, implicit numeric widening, checked integer overflow, modules and imports, WIT imports, `test` blocks, `@target`, `@extern`, `@export`, `export fn` and `@deprecated`.

## Standard library

See the [prelude](../stdlib/prelude.md) and the [standard library modules](../stdlib/modules.md) available on each target.

## Known limitations

- `std.io`, `std.fs` and `std.env` exist only on `wasi`, and `std.dom` only on `browser`, as the specification says.
- Other WASI hosts can run `wasi` components that use workers only if they implement the `puddi:runtime` worker interfaces.
- The embedded runner links WASI 0.3.0 from Wasmtime, which satisfies the 0.3.2 imports through semver matching.
- `pud test` runs tests on the JavaScript host, so tests cannot call WIT imports.
- Grapheme segmentation is an approximation (combining marks, variation selectors, ZWJ sequences), and case mapping covers ASCII only.

## Deferred past version 1

The specification defers these on purpose:

- shared-memory threads, until WasmGC can share objects across threads
- `where` clauses
- const generics
- user-defined derives and compile-time execution
