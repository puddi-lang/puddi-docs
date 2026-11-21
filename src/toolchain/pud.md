# The pud command

All tooling goes through one command.

| Command | Purpose |
|---|---|
| `pud new <name>` | create a package |
| `pud build [path] [--target t] [--emit-wat] [-o dir]` | build a component for `wasi` (default), `browser` or `plugin` |
| `pud run [path\|file.pud] [-- args]` | build and run |
| `pud test [path\|file.pud] [filter]` | run `test` blocks |
| `pud check [path\|file.pud]` | type-check without generating code |
| `pud fmt [files] [--check]` | format sources in the official style |
| `pud doc [path]` | write Markdown docs for public items |
| `pud add <repo@version\|path> [--name n]` | add a dependency |
| `pud version` | print the version |

For build, run, test, check and doc, `path` can be a package directory, the package’s `pud.toml` or a single source file. An omitted path starts manifest discovery in the current directory and searches its parents. To treat a source file as part of a package, pass the package path.

## Single-file mode

Any `.pud` file can be checked, run or tested without a package. It may import the standard library and WIT interfaces, but not dependencies.

```sh
pud run script.pud -- input.txt
```

## `pud build`

Compiles the package to a WebAssembly component in `target/<target>/<name>.wasm`.

- `--target wasi|browser|plugin` (or `-t`) picks the [target](targets.md).
- `--emit-wat` also writes the core module as WebAssembly text, which is useful when you work on the compiler.
- `-o dir` or `--out dir` writes the build output to a different directory.

## `pud run`

Builds and runs. What running means depends on the target:

| Target | `pud run` |
|---|---|
| `wasi` | runs `main` in the embedded Wasmtime; arguments after `--` go to the program |
| `browser` | serves the page on loopback and prints the URL to open |
| `plugin` | `pud run --target plugin -- <export> [args]` calls one export and prints the result |

`PUD_HOST=node pud run` runs a `wasi` program's core module with Node.js instead of the embedded runtime.

## `pud test`

Compiles the package with its `test` blocks and runs each test in a fresh instance on Node.js. The optional filter, after the path, runs only the tests whose name contains it:

```sh
pud test . parser
```

## `pud fmt`

Formats sources in the single official style. There are no options to configure. `--check` changes nothing and exits with status 1 if a file would change, which suits CI.

## `pud doc`

Collects `///` doc comments of public items into `target/doc/<name>.md` for a package. For a single file it writes `<name>.md` in the current directory.

```puddi,ignore
/// Splits a line into words, dropping empty ones.
pub fn words(line: Str) -> List<Str> { line.split_whitespace() }
```

## `pud add`

```sh
pud add github.com/someone/lib@1.2     # a git dependency
pud add ../shared --name shared         # a local path dependency
```

Adds the entry to `[deps]` in `pud.toml` and updates `pud.lock`. See [Dependencies](dependencies.md).

## Environment variables

| Variable | Effect |
|---|---|
| `PUD_HOST=node` | run the `wasi` core module with Node.js and its JavaScript host shims |
| `PUD_PORT` | first port to try for the browser dev server; defaults to 8000 |

For options introduced on the compiler’s main branch, see [Compiler development](../reference/compiler.md).
