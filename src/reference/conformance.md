# Conformance suite

The [language specification](spec.md) is the normative definition of Puddi. The conformance suite, in [conformance/](https://github.com/puddi-lang/puddi/tree/main/conformance) of the compiler repository, checks a `pud` binary against it from the outside:

- every case names the spec sections it verifies;
- every normative section (chapters 2 to 10) has at least one passing case, and CI fails if one does not;
- cases marked `xfail` record where the compiler still differs from the spec. A known gap that gets fixed makes the run fail until the marker is removed, so the list stays accurate.

Puddi 0.1 passes 143 cases and has 7 known gaps, covering all 54 normative sections. Every release binary is checked with the suite before it is published (except the cross-compiled macOS Intel build).

## Running it

The suite needs Node.js 22 or newer and runs against any `pud`, including an installed release:

```sh
git clone https://github.com/puddi-lang/puddi
cd puddi
node conformance/run.mjs --pud ~/.pud/bin/pud --coverage
```

| Option | Effect |
|---|---|
| `--pud <path>` | the binary to test (default: `target/release/pud`, then `target/debug/pud`, then `pud`) |
| `--filter <text>` | only cases for a section such as `3.7`, or whose path contains the text |
| `--coverage` | print a per-section report |
| `--strict-coverage` | fail when a normative section has no passing case |
| `--json <file>` | write a machine-readable report |
| `--list` | list the cases without running them |

## Known gaps in 0.1

| Section | Gap |
|---|---|
| 2.4 | no warnings for naming-convention violations |
| 2.4 | struct literals need an uppercase type name |
| 3.7 | `U8 + 0.5` does not default the literal to `Float` |
| 3.12 | `Self.Item` does not resolve inside an `impl` |
| 3.12 | a duplicate `impl` is accepted |
| 4.6 | `let inc = \|x\| x + 1` needs a parameter annotation |
| 8.3 | exports that use WIT records, variants, enums or flags fail to compile |

## Writing cases

A case is a `.pud` file (or a small package) with a header of `//` comments that names the sections it covers and how to run it, and `//>` lines with the expected output. The format is described in the suite's [README](https://github.com/puddi-lang/puddi/blob/main/conformance/README.md). A change to the specification's normative text should come with cases for it; see [Contributing](../community/contributing.md).
