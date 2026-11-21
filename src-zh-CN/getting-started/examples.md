# 内置示例

[编译器仓库](https://github.com/puddi-lang/puddi)提供四个小型示例包。先安装 `pud`，再克隆仓库。下表中的命令从仓库根目录开始执行。

| 包 | 内容 | 命令 |
|---|---|---|
| [todo](https://github.com/puddi-lang/puddi/tree/v0.1.2/examples/todo) | 读取 JSON 与处理错误 | `cd examples/todo` 后运行 `pud run` |
| [wordfreq](https://github.com/puddi-lang/puddi/tree/v0.1.2/examples/wordfreq) | 读取标准输入并用映射统计词频 | `printf 'a b a\n' \| pud run examples/wordfreq` |
| [plugin](https://github.com/puddi-lang/puddi/tree/v0.1.2/examples/plugin) | 实现自定义 WIT world 的导出 | `pud build examples/plugin --target plugin` |
| [plugin-host](https://github.com/puddi-lang/puddi/tree/v0.1.2/examples/plugin-host) | 在一个组件中使用多种宿主能力 | `pud build examples/plugin-host --target plugin` |

`todo` 在进程工作目录读取 `todos.json`，会输出 `2 of 4 left`。`wordfreq` 输出 `a` 出现 2 次、`b` 出现 1 次。两个插件分别在各自包目录中生成 `target/plugin/plug.wasm` 和 `target/plugin/plugin-host.wasm`。

需要实际调用插件时，可照着[插件入门](../interop/plugins.md)运行。`plugin` 示例的 `greet` 导出需要宿主提供 `demo:host/log`，而 `classify` 不会调用该接口。
