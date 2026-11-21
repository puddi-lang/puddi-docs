# 简介

Puddi 是一门静态类型、面向表达式的语言，编译目标是 WebAssembly。同一套语法可以用于浏览器、WASI 运行时和插件宿主。程序使用 WebAssembly 引擎的垃圾回收功能 WasmGC，通过组件模型与宿主交互。

```puddi
@derive(Eq, Show)
struct Todo {
    title: Str
    var done: Bool
}

fn main() {
    let todos = [Todo { title: "spec", done: true }, Todo { title: "compiler", done: false }]
    let pending = todos.filter(|t| !t.done)
    print("{pending.len()} of {todos.len()} left")
}
```

```text,output
1 of 2 left
```

## 语言概览

| 主题 | Puddi |
|---|---|
| 产物 | WebAssembly，浏览器使用 JavaScript 加载器 |
| 宿主 | `browser`、`wasi`（WASI 0.3）、`plugin` |
| 内存管理 | WasmGC |
| 类型 | 静态类型，局部类型推断 |
| 多态 | 泛型、名义特征和 `dyn Trait` |
| 缺失值与错误 | `Option`、`Result`、`?`、`AnyErr`；panic 触发陷阱 |
| 可变性 | `let` 与 `var`；逐字段声明可变性 |
| 数值 | `Int` 为 32 位有符号整数，溢出触发陷阱，无损拓宽可隐式进行 |
| 并发 | `async fn`、`.await`、结构化任务作用域与隔离的工作线程 |
| 工具链 | `pud` 命令、`pud.toml` 包清单与基于 Git 的包 |

## 阅读路线

| 我想 | 从这里开始 |
|---|---|
| 跑通第一个程序 | [安装](getting-started/installation.md) → [第一个程序](getting-started/hello.md) → [内置示例](getting-started/examples.md) |
| 学习语法和类型 | 从[绑定与值](guide/bindings.md)开始阅读语言指南 |
| 在网页里运行 | [浏览器](interop/browser.md)与[标准库](stdlib/modules.md) |
| 给现有宿主编写插件 | [插件](interop/plugins.md)与 [WIT 导入](interop/wit.md) |
| 查命令或解决错误 | [pud 命令](toolchain/pud.md)与[故障排查](toolchain/troubleshooting.md) |
| 参与开发 | [编译器开发](reference/compiler.md)与[参与贡献](community/contributing.md) |

本书以首个正式发行版 Puddi 0.1 为基线。中英文完整示例由同一发行版工具链检查。语言规范仍是草案，0.x 版本之间可能变化。查看[语言规范](reference/spec.md)、[实现状态](reference/status.md)和[更新日志](reference/changelog.md)可了解各自的版本范围。

## 获取帮助

- 问题和想法：[Puddi Discussions](https://github.com/puddi-lang/puddi/discussions)
- 编译器和工具链问题：[Puddi Issues](https://github.com/puddi-lang/puddi/issues)
- 文档问题：[文档仓库 Issues](https://github.com/puddi-lang/puddi-docs/issues)或页面上方的编辑入口
