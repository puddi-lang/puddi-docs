# 更新日志

<!-- Puddi release: v0.1.2 -->

本页记录 Puddi 0.1 系列的正式发布内容。后续主分支进展见[上游更新日志](https://github.com/puddi-lang/puddi/blob/main/CHANGELOG.md#unreleased)。

## 0.1.2

发布于 2026-11-21。

### 标准库

- 新增 10 个便携模块，涵盖集合、惰性迭代、文本和格式化、二进制读取、编码、路径、CSV、日期时间和统计。
- JSON 增加指针查找和缩进输出，CSV 支持自定义分隔符，`std.fmt` 支持解析 2 至 36 进制整数。

### 修复

- 支持前向类型别名并诊断循环。常量中的名称在声明模块解析。
- 修复浮点字面量拓宽、闭包参数推断、特征实现方法中的关联类型，以及命名约定相关的诊断和解析。
- 拒绝重叠的特征实现、循环父特征、非法 UTF-8 和不合法的 JSON 代理对。
- WIT 导出支持接口声明的记录、变体、枚举和标志位。`pud fmt` 保留多行字符串里的尾随空白。

[查看完整发行说明](https://github.com/puddi-lang/puddi/releases/tag/v0.1.2)

## 0.1.1

发布于 2026-11-21。本次更新改进了实现 0.1 语言规范草案的工具链。

### 修复

- `pud` 在解析 `--target=<值>` 时会拒绝未知或空的目标名，与 `--target <值>` 和 `-t <值>` 一致。见 [PR #6](https://github.com/puddi-lang/puddi/pull/6)。

### 性能

- 内置汇编器可并行组装生成的 WebAssembly 文本。编译器也可并行解析大文件并生成函数代码。
- `pud build` 和 `pud run` 会复用输入未变的构建产物。Wasmtime 按函数缓存机器码，修改源码后可复用未变函数的编译结果。
- Wasmtime 使用复制式垃圾回收。新的 IR 优化器减少闭包和小函数调用开销，迭代器和标准库中的排序、映射等操作也减少了内存分配和重复工作。

### 文档

- 上线完整简体中文文档，覆盖语言指南、规范、工具链、互操作及标准库。
- 新增贡献指南、行为准则、安全策略、编译器架构与发布流程，以及尚未生效的治理草案。

0.1 草案的[已知一致性差异](conformance.md#known-gaps-in-01)仍适用。[查看完整发行说明](https://github.com/puddi-lang/puddi/releases/tag/v0.1.1)。

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
