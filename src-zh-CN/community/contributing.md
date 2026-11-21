# 参与贡献

欢迎提交问题、一致性用例、编译器修复、标准库改进、示例和文档。可以用中文或英文交流。

| 仓库 | 内容 |
|---|---|
| [puddi-lang/puddi](https://github.com/puddi-lang/puddi) | 语言规范、编译器、标准库、一致性测试 |
| [puddi-lang/puddi-docs](https://github.com/puddi-lang/puddi-docs) | 中英文文档站 |

编译器的[贡献指南](https://github.com/puddi-lang/puddi/blob/main/CONTRIBUTING.md)说明如何构建和测试。想了解实现可以先看[编译器开发](../reference/compiler.md)。

## 从哪里开始

- **挑选小任务**：查看 [good first issue](https://github.com/puddi-lang/puddi/labels/good%20first%20issue)，或到[讨论区](https://github.com/puddi-lang/puddi/discussions)问一问
- **报告问题**：附最小示例、`pud version`、运行命令、实际结果和预期结果
- **修正规范差异**：从[已知差异](../reference/conformance.md#known-gaps-in-01)选一个，对应用例会提示修复是否生效
- **改进文档**：从页面上方的编辑入口开始；语义和示例改动请同步至 `src/` 和 `src-zh-CN/` 对应页面

## 修改语言

修改规范性文字可能改变有效程序的范围或程序含义。先开 Issue 说明问题、拟议规则和对现有程序的影响。实施时应同时更新一致性用例。尚未实现的规则可用 `xfail` 标注差异。[治理草案](governance.md)说明了计划中的 RFC 流程。

## 构建文档

```sh
git clone https://github.com/puddi-lang/puddi-docs
cd puddi-docs
tools/build.sh                       # build English and Simplified Chinese
python3 -m http.server --directory book 8000
node tools/check-examples.mjs       # compile and run every example with pud
```

需要 mdBook 0.5、Node.js 22 或更新版本，以及 `PUDDI_VERSION` 中指定的 `pud` 发行版。CI 会检查声明 `fn main` 或 `test` 的 `puddi` 代码块；紧跟着的 `text,output` 块是运行预期。不能独立检查的示例用 `puddi,ignore`，预期拒绝的用 `puddi,fail`，浏览器示例用 `puddi,browser`。

贡献适用各仓库说明的 MIT 或 Apache 2.0 双许可证。
