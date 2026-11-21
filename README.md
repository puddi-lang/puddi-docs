# Puddi documentation

[English edition](https://puddi-lang.github.io/puddi-docs/) · [简体中文文档](https://puddi-lang.github.io/puddi-docs/zh-CN/)

The two editions cover installation, the language guide, the toolchain, host interop, the standard library and the language specification. English chapters live in `src/`, Simplified Chinese chapters in `src-zh-CN/`. Keep their chapter paths in sync so the language links match.

The English specification and changelog are synchronized from the [compiler repository](https://github.com/puddi-lang/puddi) at [`PUDDI_VERSION`](PUDDI_VERSION). The Chinese reference pages are maintained translations of that release.

## Building locally

You need [mdBook](https://rust-lang.github.io/mdBook/) 0.5, Node.js 22 or newer, and [`pud`](https://github.com/puddi-lang/puddi#install).

```sh
tools/build.sh
python3 -m http.server --directory book 8000
node tools/check-examples.mjs --jobs 1
```

Preview the English edition at `http://localhost:8000/` and the Chinese edition at `http://localhost:8000/zh-CN/`.

## Examples are tested

In both editions, a ```` ```puddi ```` block that declares `fn main` or a `test` block is checked with `pud` in CI. A ```` ```text,output ```` block immediately after a program is compared with the output of `pud run`. Identical examples and expected results run once across the two editions. Specification and changelog code blocks are reference material and are excluded. Add words after the language name to change how a block is checked:

| Info string | Meaning |
|---|---|
| `puddi,ignore` | not checked (for example multi-file examples) |
| `puddi,fail` | must be rejected by `pud check` |
| `puddi,browser` | checked for the browser target |

## Publishing

Pushes to `main` build both editions and deploy them together to GitHub Pages ([.github/workflows/pages.yml](.github/workflows/pages.yml)). Pull requests run the same checks without deploying. After a Puddi release, update `PUDDI_VERSION`, translate the changed specification and release notes, update the `Puddi release` markers in both Chinese reference pages, and revise affected chapters in both editions.

## License

Licensed under either of [Apache License, Version 2.0](LICENSE-APACHE) or [MIT License](LICENSE-MIT) at your option. Unless you explicitly state otherwise, any contribution intentionally submitted for inclusion in this work, as defined in the Apache-2.0 license, shall be dual licensed as above, without any additional terms or conditions.
