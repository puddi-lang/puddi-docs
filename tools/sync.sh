#!/bin/sh
# Copies the specification and changelog of the Puddi release named in
# PUDDI_VERSION into the book. Run before `mdbook build`.
set -eu
cd "$(dirname "$0")/.."
version=$(tr -d '[:space:]' < PUDDI_VERSION)
base="https://raw.githubusercontent.com/puddi-lang/puddi/$version"

fetch() {
    curl -fsSL --retry 3 "$base/$1"
}

{
    fetch SPEC.md | sed '1a\
\
> This page is the specification as of Puddi '"$version"', copied from [SPEC.md](https://github.com/puddi-lang/puddi/blob/'"$version"'/SPEC.md) in the compiler repository. Section numbers match the ones cited by the conformance suite.'
} > src/reference/spec.md

{
    fetch CHANGELOG.md | sed '1a\
\
> Copied from [CHANGELOG.md](https://github.com/puddi-lang/puddi/blob/'"$version"'/CHANGELOG.md) at Puddi '"$version"'.'
} > src/reference/changelog.md

echo "synced SPEC.md and CHANGELOG.md from $version"
