# Installation

`pud` is a single executable that contains the compiler, the formatter, the package manager and a WebAssembly runtime for the `wasi` target.

## Install script

macOS and Linux, on x86_64 or arm64:

```sh
curl -fsSL https://raw.githubusercontent.com/puddi-lang/puddi/main/install.sh | sh
```

Windows, in PowerShell:

```powershell
irm https://raw.githubusercontent.com/puddi-lang/puddi/main/install.ps1 | iex
```

The script downloads the latest [release](https://github.com/puddi-lang/puddi/releases), checks its SHA-256 checksum, installs `pud` into `~/.pud/bin` and adds that directory to your `PATH` (through `~/.profile`, `~/.bashrc`, `~/.zshrc` and fish's `conf.d` on Unix, or the user `PATH` on Windows). Open a new terminal afterwards, or follow the command the script prints.

| Variable | Effect |
|---|---|
| `PUD_VERSION` | install a specific release, for example `v0.1.0` (default: latest) |
| `PUD_INSTALL` | install into this directory instead of `~/.pud` |
| `PUD_NO_MODIFY_PATH` | set to `1` to leave shell profiles and `PATH` alone |

```sh
curl -fsSL https://raw.githubusercontent.com/puddi-lang/puddi/main/install.sh | PUD_VERSION=v0.1.0 sh
```

Run the script again to upgrade. To uninstall, delete `~/.pud` and the line the script added to your shell profile.

## Release archives

Every [release](https://github.com/puddi-lang/puddi/releases) has archives for these targets, each with a `.sha256` file, plus a combined `SHA256SUMS`:

| Archive | Platform |
|---|---|
| `pud-x86_64-unknown-linux-gnu.tar.gz` | Linux x86_64 (glibc 2.35 or newer) |
| `pud-aarch64-unknown-linux-gnu.tar.gz` | Linux arm64 (glibc 2.35 or newer) |
| `pud-x86_64-apple-darwin.tar.gz` | macOS Intel |
| `pud-aarch64-apple-darwin.tar.gz` | macOS Apple silicon |
| `pud-x86_64-pc-windows-msvc.zip` | Windows x64 (also used on Windows arm64) |

Unpack the archive and put `pud` (or `pud.exe`) anywhere on your `PATH`.

## From source

With a current stable Rust toolchain:

```sh
cargo install --locked --git https://github.com/puddi-lang/puddi --tag v0.1.0
```

`cargo install --no-default-features` builds `pud` without the embedded runtime. It compiles much faster, but `pud run` then needs an external WASI 0.3 host (see [Targets](../toolchain/targets.md)).

## Node.js

`pud test` and the `browser` target run code on a JavaScript host and need Node.js 22 or newer. Async code under Node.js needs JSPI, which is enabled by default from Node.js 24. Everything else works without Node.js.

## Check the installation

```sh
pud --version
```
