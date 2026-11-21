#!/bin/sh
# Build both books into the same GitHub Pages artifact.
set -eu
cd "$(dirname "$0")/.."

version=$(tr -d '[:space:]' < PUDDI_VERSION)
for page in src-zh-CN/reference/spec.md src-zh-CN/reference/changelog.md; do
    if ! grep -Fqx "<!-- Puddi release: $version -->" "$page"; then
        printf '%s\n' "Update $page for Puddi $version before publishing" >&2
        exit 1
    fi
done

tools/sync.sh
mdbook build
MDBOOK_BOOK__SRC=src-zh-CN \
MDBOOK_BOOK__LANGUAGE=zh-CN \
MDBOOK_BOOK__TITLE='Puddi 简体中文文档' \
MDBOOK_BOOK__DESCRIPTION='Puddi 的语言指南 工具链 标准库和语言规范' \
MDBOOK_OUTPUT__HTML__SITE_URL=/puddi-docs/zh-CN/ \
    mdbook build --dest-dir book/zh-CN
