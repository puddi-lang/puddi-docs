# Contributing

Puddi is developed in the open on GitHub and contributions are welcome: bug reports, conformance cases, compiler fixes, standard library work, examples and documentation.

| Repository | What lives there |
|---|---|
| [puddi-lang/puddi](https://github.com/puddi-lang/puddi) | the specification, the `pud` toolchain, the standard library and the conformance suite |
| [puddi-lang/puddi-docs](https://github.com/puddi-lang/puddi-docs) | this book |

The compiler repository's [CONTRIBUTING.md](https://github.com/puddi-lang/puddi/blob/main/CONTRIBUTING.md) explains how to build and test the toolchain, and [docs/architecture.md](https://github.com/puddi-lang/puddi/blob/main/docs/architecture.md) walks through the compiler.

## Ways to help

- **Report a bug.** Open an [issue](https://github.com/puddi-lang/puddi/issues) with the smallest program that shows it, the `pud version` output and what you expected.
- **Add a conformance case.** If you find a place where the compiler and the specification disagree, a failing case (marked `xfail` until it is fixed) is often the most useful contribution.
- **Fix a known gap.** The [known gaps](../reference/conformance.md#known-gaps-in-01) each have a case that will tell you when you are done.
- **Find a first task.** Browse [good first issues](https://github.com/puddi-lang/puddi/labels/good%20first%20issue) or ask in [Discussions](https://github.com/puddi-lang/puddi/discussions).
- **Improve this book.** Every chapter has an edit button. CI checks complete examples in both languages. When changing a technical explanation or example, update the corresponding page in `src/` and `src-zh-CN/`.

## Changing the language

The specification is the definition of the language, so a change to its normative text is a language change. For now, open an issue that describes the problem, the proposed text and its effect on existing programs, and discuss it there before sending a pull request. A spec change is merged together with conformance cases for it and, when it is not already implemented, an `xfail` marker. A more formal RFC process is drafted in the [governance](governance.md) document for when the community grows.

## Working on the book

```sh
git clone https://github.com/puddi-lang/puddi-docs
cd puddi-docs
tools/build.sh                       # build English and Simplified Chinese
python3 -m http.server --directory book 8000
node tools/check-examples.mjs       # compile and run every example with pud
```

The book needs [mdBook](https://rust-lang.github.io/mdBook/) 0.5 and an installed `pud` of the version in `PUDDI_VERSION`. A ```` ```puddi ```` block that declares `fn main` or `test` is compiled by the example checker; a ```` ```text,output ```` block right after it is the expected output of `pud run`. Mark a complete example that cannot be checked in isolation with ```` ```puddi,ignore ````, one that must be rejected with `puddi,fail`, and one for the browser with `puddi,browser`.

All contributions are dual licensed under the MIT and Apache 2.0 licenses, as described in each repository's README.
