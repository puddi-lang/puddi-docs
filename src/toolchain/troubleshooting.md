# Troubleshooting

## Installation and package discovery

- **`pud` is not found.** Open a new terminal after running the installer. With the default install, check that `~/.pud/bin` is on `PATH` and run `pud version`.
- **`could not find pud.toml`.** Change to the package directory or pass its path. Pass an existing `.pud` file explicitly for single-file mode. A single file does not load sibling modules or a package dependency graph.
- **A Git dependency cannot be resolved.** Check the repository URL, Git availability, and whether the remote publishes a semver tag that satisfies your minimum. Commit `pud.lock` with `pud.toml`. See [Dependencies](dependencies.md).

## Choosing the host

| Symptom | What to check |
|---|---|
| `pud test` cannot start Node.js | Verify `node --version` in the same terminal and install Node.js 22 or newer |
| An async example reports missing JSPI | Use Node.js 24 for tests or a browser with JSPI for the browser target |
| `std.dom` is unavailable | Check or build with `--target browser` |
| `std.fs`, `std.io` or `std.env` is unavailable | Use the `wasi` target |
| The browser cannot fetch the Wasm file | Use the URL printed by `pud run --target browser` or serve every generated file over HTTP |
| An external runtime rejects a component | Check its WasmGC, exception, WASI 0.3 and Component Model async/threading support |
| A plugin export has the wrong signature | Compare the Puddi types against the [WIT type mapping](../interop/wit.md#type-mapping) |
| An imported plugin function traps | Run it in a host that supplies the imported WIT interface |

## Reporting a problem

Include `pud version`, your operating system, the command and target, the exact diagnostic, and the smallest program that reproduces it. If the program uses WIT, include the manifest’s world setting and the relevant WIT declarations. Check the [known gaps](../reference/conformance.md#known-gaps-in-01), then file a [compiler issue](https://github.com/puddi-lang/puddi/issues/new/choose) or ask in [Discussions](https://github.com/puddi-lang/puddi/discussions).
