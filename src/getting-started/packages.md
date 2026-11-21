# Packages

A package is a directory with a `pud.toml` manifest and a `src/` directory.

```sh
pud new hello
cd hello
pud run
```

`pud new` creates:

```text
hello/
├── pud.toml
└── src/
    └── main.pud
```

with this manifest:

```toml
[package]
name = "hello"
version = "0.1.0"
puddi = "0.1"
```

Inside a package, `pud` commands work on the whole package and look for `pud.toml` in the current directory or a parent directory, so `pud run`, `pud test` and `pud build` need no arguments.

## Modules

Each file is a module, named after its path under `src/`. `src/main.pud` is the root of a program (`src/lib.pud` for a library), `src/geometry.pud` is the module `geometry` and `src/net/url.pud` is `net.url`.

```puddi,ignore
// src/geometry.pud
pub struct Point {
    pub x: Float
    pub y: Float
}

pub fn distance(a: Point, b: Point) -> Float {
    ((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y)).sqrt()
}
```

```puddi,ignore
// src/main.pud
import geometry
import geometry.{Point}

fn main() {
    let d = geometry.distance(Point { x: 0.0, y: 0.0 }, Point { x: 3.0, y: 4.0 })
    print("{d}")
}
```

Items are private to their module unless they are marked `pub`. See [Modules](../guide/modules.md) for the details.

## Building

```sh
pud build                     # target/wasi/hello.wasm
pud build --target browser    # target/browser/hello.wasm and puddi.mjs
pud run --target browser      # build and serve on http://127.0.0.1:8000
```

The build output is a WebAssembly component in `target/<target>/`. The generated `.gitignore` already excludes `target/`. See the [target matrix](../toolchain/targets.md) for the files each build produces.

## Dependencies

```sh
pud add github.com/someone/lib@1.2
```

adds the dependency to `pud.toml` and records its exact commit in `pud.lock`, which belongs in version control. See [Dependencies](../toolchain/dependencies.md).

## Tests

`test` blocks can sit next to the code they test, in any file:

```puddi
fn add(a: Int, b: Int) -> Int { a + b }

test "addition" {
    assert_eq(add(2, 2), 4)
}
```

`pud test` compiles and runs them, each in a fresh instance. See [Testing](../guide/testing.md).
