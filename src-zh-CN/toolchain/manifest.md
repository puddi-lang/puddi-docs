# 包清单

`pud.toml` 位于包的根目录。

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

## package

| 键 | 含义 |
|---|---|
| `name` | 包名，用于构建产物和依赖引用 |
| `version` | 包版本，遵循语义化版本格式 |
| `puddi` | 该包使用的语言版本 |

## deps

每项定义一个依赖及其来源。可以引用 Git 仓库及最低版本，也可以引用本地路径。键名用于 `import`。见[依赖](dependencies.md)。

## target wasi

`[target.wasi]` 的 `world` 指定组件的 WIT world，缺省值为 `wasi:cli/command`。

## target plugin

`[target.plugin]` 必须设置 `world`，格式为相对包目录的 `<file>#<world>`，例如 `wit/host.wit#plugin`。

## 包目录结构

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

包内 `wit/` 下的接口可以和工具链自带的 WASI 及 `puddi:runtime` 接口一同导入。见 [WIT 导入](../interop/wit.md)。
