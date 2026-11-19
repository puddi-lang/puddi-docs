# Dependencies

A dependency is either a git repository with semver tags or a directory on disk.

```toml
[deps]
json = "github.com/someone/puddi-json@1.2"
util = { path = "../util" }
```

The key (`json`, `util`) is the name the dependency is imported by. Modules of a dependency are imported through that name: `import json` for its root module, `import json.parser` for others. Only `pub` items are visible.

## Git dependencies

The version after `@` is a minimum. Releases of a package are git tags such as `v1.2.0` in its repository. `pud add` writes the entry and resolves it:

```sh
pud add github.com/someone/puddi-json@1.2
```

### Minimal version selection

Versions are chosen with minimal version selection: every dependency gets the *lowest* version that satisfies every requirement on it in the whole dependency graph. A build therefore never picks up a release that nobody asked for, and the result is the same with or without a lock file.

Different major versions of one package are different packages and can be used side by side.

### `pud.lock`

The lock file records the exact commit of every tag that was resolved, so a tag that is moved later does not change your build. Commit `pud.lock` to version control.

## Path dependencies

```toml
[deps]
util = { path = "../util" }
```

A path dependency is a package directory, relative to the manifest. It is useful in a repository with several packages, or while you work on a library and an application together.

## Rules

- Dependencies between packages must not form a cycle. Modules inside one package may import each other in cycles.
- Single-file programs (`pud run file.pud`) cannot have dependencies.
- An `impl Trait for Type` must live in the package that defines the trait or the one that defines the type.
