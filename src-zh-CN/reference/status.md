# 实现状态

[一致性测试套件](conformance.md)按 Puddi 0.1 语言规范草案检查 `pud` 的行为。

## 语言

支持结构体、枚举、元组、带约束且单态化的泛型、默认方法、关联类型、父特征、`dyn Trait`、运算符特征、引用捕获闭包和带穷尽性检查的模式匹配。模式包括守卫、区间、或模式、列表模式、`let ... else`、`if let`、`while let`。

还支持 `?` 与 `From` 错误转换、`AnyErr.downcast`、`@derive(Eq, Ord, Hash, Show, Transfer)`、常量、类型别名、`async fn`、`.await`、结构化取消、工作线程、隐式数值拓宽、整数溢出检查、模块、WIT 导入、`test`、`@target`、`@extern`、`@export`、`export fn` 和 `@deprecated`。

## 标准库

见[预导入项](../stdlib/prelude.md)和[各目标可用的模块](../stdlib/modules.md)。

## 已知限制

- `std.io`、`std.fs`、`std.env` 仅在 `wasi` 上提供，`std.dom` 仅在 `browser` 上提供
- 外部 WASI 宿主须实现 `puddi:runtime` 工作线程接口，才能运行使用工作线程的组件
- 内嵌运行时链接 Wasmtime 的 WASI 0.3.0，通过语义化版本匹配满足 0.3.2 接口导入
- `pud test` 运行在 JavaScript 宿主，不能调用 WIT 导入
- 字素分割为近似实现，能处理组合标记、变体选择符和零宽连接序列。大小写转换仅覆盖 ASCII

## v1 之后

草案将共享内存线程、`where` 子句、常量泛型、自定义派生和编译期执行留到 v1 之后。
