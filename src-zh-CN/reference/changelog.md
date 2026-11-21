# 更新日志

<!-- Puddi release: v0.1.0 -->

本页记录 Puddi v0.1.0 的正式发布内容。后续主分支进展见[上游更新日志](https://github.com/puddi-lang/puddi/blob/main/CHANGELOG.md#unreleased)。

## 0.1.0

发布于 2026-11-18。Puddi 和 `pud` 工具链的首个发行版，实现了 0.1 语言规范草案。

### 语言

- 结构体、枚举、元组、受约束的泛型、默认方法、关联类型、父特征、`dyn Trait`、运算符特征和闭包
- 带穷尽性检查的模式匹配，以及 `if let`、`while let` 和 `let ... else`
- `?` 与 `From` 转换、`Error` 特征和 `AnyErr`
- `@derive(Eq, Ord, Hash, Show, Transfer)`、常量、类型别名、模块与导入
- `async fn`、`.await`、支持结构化取消的 `task.scope`、工作线程
- WIT 导入、`export fn`、`@extern`、`@export`、`@target`、`@deprecated` 与 `test` 块

### 工具链

- `pud new`、`build`、`run`、`test`、`check`、`fmt`、`doc` 和 `add`
- `browser`、`wasi`（WASI 0.3）与 `plugin` 目标均生成基于 WasmGC 的组件
- `pud run` 内嵌 Wasmtime
- Git 依赖采用最小版本选择，并写入 `pud.lock`，也支持本地路径依赖

### 测试和分发

- `conformance/` 为规范性小节提供一致性用例
- Linux、macOS 和 Windows 持续集成
- 提供 Linux 和 macOS 的 x86_64、arm64 产物，以及 Windows x64 产物和安装脚本

### 已知差异

命名警告、类型名小写的结构体字面量、混合浮点与无符号整数、关联类型、重复实现、未注明的闭包参数和部分 WIT 导出，详见[一致性测试](conformance.md#known-gaps-in-01)。

[查看 v0.1.0 发行版](https://github.com/puddi-lang/puddi/releases/tag/v0.1.0)
