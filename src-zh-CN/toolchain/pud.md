# pud 命令

Puddi 的工具链统一通过 `pud` 访问。

| 命令 | 用途 |
|---|---|
| `pud new <name>` | 创建包 |
| `pud build [path] [--target t] [--emit-wat] [-o dir]` | 构建组件，默认目标是 `wasi` |
| `pud run [path\|file.pud] [-- args]` | 构建后运行 |
| `pud test [path\|file.pud] [filter]` | 运行测试块 |
| `pud check [path\|file.pud]` | 检查类型，不生成代码 |
| `pud fmt [files] [--check]` | 按官方风格格式化源码 |
| `pud doc [path]` | 为公开声明生成 Markdown |
| `pud add <repo@version\|path> [--name n]` | 添加依赖 |
| `pud version` | 输出版本 |

`build`、`run`、`test`、`check`、`doc` 可接受包目录、`pud.toml` 或单个源文件的路径。省略路径时从当前目录向上查找清单。把源文件作为包的一部分处理时，请传入包路径。

## 单文件模式

`.pud` 文件可脱离包检查、运行和测试，也可导入标准库及工具链提供的 WIT 接口。单文件不能使用包依赖。

```sh
pud run script.pud -- input.txt
```

## 构建

默认在 `target/<target>/<name>.wasm` 生成 WebAssembly 组件。

- 用 `--target` 或 `-t` 选择 `wasi`、`browser`、`plugin`。见[构建目标](targets.md)
- `--emit-wat` 另存核心模块的 WebAssembly 文本
- `-o dir` 或 `--out dir` 指定输出目录

## 运行

| 目标 | `pud run` 的行为 |
|---|---|
| `wasi` | 用内嵌 Wasmtime 运行 `main`，将 `--` 后的参数传给程序 |
| `browser` | 在回环地址启动开发服务器，并输出访问 URL |
| `plugin` | 用 `pud run --target plugin -- <export> [args]` 调用一个导出并输出结果 |

`PUD_HOST=node pud run` 用 Node.js 和 JavaScript 宿主函数运行 `wasi` 的核心模块。

## 测试

Node.js 为每个测试创建一个新实例。路径参数之后可跟一个筛选词，只运行名字包含该词的测试。

```sh
pud test . parser
```

## 格式化

`pud fmt` 使用固定风格。加上 `--check` 只检查，不修改文件；有文件需格式化时返回状态码 1。传入 `.pud` 文件可限定范围。

## 生成文档

`pud doc` 从公开声明收集 `///` 注释。包的文档输出到 `target/doc/<name>.md`，单文件模式则在当前目录生成 `<name>.md`。

```puddi,ignore
/// Splits a line into words, dropping empty ones.
pub fn words(line: Str) -> List<Str> { line.split_whitespace() }
```

## 添加依赖

```sh
pud add github.com/someone/lib@1.2     # a git dependency
pud add ../shared --name shared         # a local path dependency
```

命令修改 `pud.toml` 的 `[deps]` 并更新 `pud.lock`。详见[依赖](dependencies.md)。

## 环境变量

| 变量 | 效果 |
|---|---|
| `PUD_HOST=node` | 用 Node.js 的 JavaScript 宿主运行 `wasi` 核心模块 |
| `PUD_PORT` | 浏览器开发服务器的起始端口，默认为 8000 |

主分支新增选项见[编译器开发](../reference/compiler.md)。
