# Puddi documentation

Source of the Puddi documentation site: **https://puddi-lang.github.io/puddi-docs/**

The book covers installing `pud`, a guide to the language, the toolchain, host interop and the standard library. The language specification and changelog pages are copied from the [compiler repository](https://github.com/puddi-lang/puddi) at the release named in [`PUDDI_VERSION`](PUDDI_VERSION).

## Building locally

You need [mdBook](https://rust-lang.github.io/mdBook/) 0.5, Node.js 22 or newer, and [`pud`](https://github.com/puddi-lang/puddi#install).

```sh
tools/sync.sh                     # fetch SPEC.md and CHANGELOG.md for PUDDI_VERSION
mdbook serve --open               # live preview at http://localhost:3000
node tools/check-examples.mjs     # compile every example and run the ones with output
```

## Examples are tested

Every ```` ```puddi ```` block that declares `fn main` or a `test` block is compiled with `pud` in CI, and a ```` ```text,output ```` block right after it is compared with the output of `pud run`. Blocks without `fn main` are fragments and are not checked. Add words after the language name to change that:

| Info string | Meaning |
|---|---|
| `puddi,ignore` | not checked (for example multi-file examples) |
| `puddi,fail` | must be rejected by `pud check` |
| `puddi,browser` | checked for the browser target |

## Publishing

Pushes to `main` build the book and deploy it to GitHub Pages ([.github/workflows/pages.yml](.github/workflows/pages.yml)). Pull requests run the same checks without deploying. After a Puddi release, update `PUDDI_VERSION` and the pages that describe changed behavior.

## License

Licensed under either of [Apache License, Version 2.0](LICENSE-APACHE) or [MIT License](LICENSE-MIT) at your option. Unless you explicitly state otherwise, any contribution intentionally submitted for inclusion in this work, as defined in the Apache-2.0 license, shall be dual licensed as above, without any additional terms or conditions.
