# 核心 WebAssembly 互操作

组件模型是主要的宿主互操作方式。若宿主只支持核心 WebAssembly，可用 `@extern` 和 `@export` 声明原始导入和导出。

```puddi,ignore
@extern("env", "log")
fn log(msg: Str)

@export("run")
fn run() { log("hi") }
```

- `@extern(module, name)` 声明无函数体的核心导入，宿主以 `module.name` 提供实现
- `@export(name)` 将函数以指定名称导出到核心模块
- 只有数值类型与 `Str` 可直接跨越该边界，其余类型需自行编解码

支持组件的宿主适合使用 WIT 导入和 `export fn`，这样编译器可以检查完整类型。
