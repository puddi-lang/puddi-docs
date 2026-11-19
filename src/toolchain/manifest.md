# The manifest

`pud.toml` sits at the root of a package.

```toml
[package]
name = "hello"
version = "0.1.0"
puddi = "0.1"

[deps]
json = "github.com/someone/puddi-json@1.2"
util = { path = "../util" }

[target.wasi]
world = "wasi:cli/command"

[target.plugin]
world = "wit/host.wit#plugin"
```

## `[package]`

| Key | Meaning |
|---|---|
| `name` | package name, used for build outputs and by packages that depend on this one |
| `version` | the package version, in semver form |
| `puddi` | the language version the package is written for |

## `[deps]`

Each entry names a dependency and says where it comes from: a git repository with a minimum version, or a local path. The key is the name used to import it. See [Dependencies](dependencies.md).

## `[target.wasi]`

| Key | Meaning |
|---|---|
| `world` | the WIT world the component targets; default `wasi:cli/command` |

## `[target.plugin]`

| Key | Meaning |
|---|---|
| `world` | required: the host's world, written `<file>#<world>` relative to the package, for example `wit/host.wit#plugin` |

## Package layout

```text
my-package/
├── pud.toml
├── pud.lock          # written by pud; commit it
├── src/
│   ├── main.pud      # or lib.pud for a library
│   └── ...
├── wit/              # WIT files of your own, if any
└── target/           # build output; do not commit
```

WIT interfaces in the package's `wit/` directory can be imported alongside the bundled WASI and `puddi:runtime` interfaces (see [WIT imports](../interop/wit.md)).
