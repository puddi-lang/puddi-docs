# 故障排查

## 安装与查找包

- **找不到 `pud`**：安装后重新打开终端。默认安装请确认 `~/.pud/bin` 在 `PATH` 中，再运行 `pud version`
- **`could not find pud.toml`**：进入包目录或显式传入路径。单文件模式应传入实际存在的 `.pud` 文件，不会加载同目录模块或包的依赖
- **无法解析 Git 依赖**：检查仓库地址、Git 是否可用、远端是否发布了符合要求的语义化版本标签。将 `pud.lock` 和 `pud.toml` 一起提交。见[依赖](dependencies.md)

## 宿主与目标

| 现象 | 排查方向 |
|---|---|
| `pud test` 无法启动 Node.js | 在同一终端运行 `node --version`，需要 Node.js 22 或更新版本 |
| 异步示例提示缺少 JSPI | 用 Node.js 24 跑测试，或在支持 JSPI 的浏览器中运行 |
| 找不到 `std.dom` | 用 `--target browser` 检查或构建 |
| 找不到 `std.fs`、`std.io`、`std.env` | 选择 `wasi` 目标 |
| 浏览器无法加载 Wasm 文件 | 打开 `pud run --target browser` 输出的网址，或用 HTTP 一并提供所有产物 |
| 外部运行时拒绝加载组件 | 检查 WasmGC、异常、WASI 0.3 及组件模型异步和线程支持 |
| 插件导出签名不匹配 | 对照 [WIT 类型映射](../interop/wit.md#type-mapping)检查类型 |
| 调用插件导入时触发陷阱 | 使用提供该 WIT 接口的宿主 |

## 报告问题

请附上 `pud version`、操作系统、命令、目标、完整诊断和可复现的最小程序。涉及 WIT 时也请附上清单中的 world 和相关声明。可先查[已知差异](../reference/conformance.md#known-gaps-in-01)，再[报告问题](https://github.com/puddi-lang/puddi/issues/new/choose)或在[讨论区](https://github.com/puddi-lang/puddi/discussions)提问。
