# 编译器开发

Puddi 将源码和 WIT 绑定编译为 WebAssembly。主分支的完整流程见[编译器架构](https://github.com/puddi-lang/puddi/blob/main/docs/architecture.md)。

| 阶段 | 工作 | 文件入口 |
|---|---|---|
| 源码加载 | 查找模块、解析依赖、生成 WIT 绑定 | `src/main.rs`、`src/deps.rs`、`src/wit.rs` |
| 前端 | 分词、语法分析、展开派生、解析名称 | `src/lexer.rs`、`src/parser.rs`、`src/derive.rs`、`src/program.rs` |
| 类型检查和降级 | 检查类型与模式、单态化泛型、生成有类型的 IR | `src/elab.rs`、`src/exhaust.rs`、`src/ir.rs` |
| WebAssembly | 生成 WasmGC 类型和指令、编码核心模块并封装组件 | `src/codegen.rs`、`src/wit.rs` |
| 宿主 | 在 Wasmtime 中运行组件，或由 JavaScript 宿主加载核心模块 | `src/runner.rs`、`src/runtime.mjs` |

## v0.1.0 之后的主分支改动

本书示例用 `PUDDI_VERSION` 指定的发行版检查。主分支新增 IR 优化、自研 WebAssembly 汇编器、并行解析与代码生成、构建和机器码缓存，并调整了 Wasmtime 的启动流程。见[尚未发布的改动](https://github.com/puddi-lang/puddi/blob/main/CHANGELOG.md#unreleased)。

| 主分支选项 | 用途 |
|---|---|
| `PUD_TIME=1` | 打印各阶段的耗时 |
| `PUD_NO_CACHE=1` | 关闭构建与 Wasmtime 缓存 |
| `PUD_NO_OPT=1` | 跳过 IR 优化 |
| `PUD_WAT=1` | 使用 `wat` crate 替代内建汇编器 |
| `PUD_ASM_CHECK=1` | 用两套汇编实现生成并比较结果 |
| `PUD_SERIAL_CODEGEN=1` | 单线程生成 WebAssembly 文本 |

## 选择测试类型

语言规范规则发生变化时，添加[一致性用例](conformance.md#writing-cases)。运行期回归可加入编译器仓库的 `tests/run`，应拒绝的程序加入 `tests/fail`。具体格式见[编译器贡献指南](https://github.com/puddi-lang/puddi/blob/main/CONTRIBUTING.md)。
