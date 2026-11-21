# WIT 导入

组件模型使用 WIT 描述宿主接口。按 WIT 名称导入接口时，Puddi 会为其生成有类型的绑定，并把接口加入组件的 world。

```puddi
import wasi:clocks/system-clock as clock

fn main() {
    let now = clock.now()
    print("{now.seconds > 0}")
}
```

```text,output
true
```

`pud` 自带 WASI 0.3 接口，包括 `wasi:cli`、`wasi:clocks`、`wasi:filesystem`、`wasi:http`、`wasi:logging`、`wasi:random`、`wasi:sockets` 和 `puddi:runtime`。包的 `wit/` 目录也可以提供 WIT 文件。

<a id="type-mapping"></a>

## 类型映射

| WIT | Puddi |
|---|---|
| `bool` | `Bool` |
| `s8` `s16` `s32` `s64` | `I8` `I16` `I32` `I64` |
| `u8` `u16` `u32` `u64` | `U8` `U16` `U32` `U64` |
| `f32` `f64` | `F32` `F64` |
| `char` | `Char` |
| `string` | `Str` |
| `list<T>` | `List<T>` |
| `option<T>` | `Option<T>` |
| `result<T, E>` | `Result<T, E>` |
| `tuple<...>` | 元组 |
| `record` | `struct` |
| `variant`、`enum` | `enum` |
| `flags` | 编译器生成由 `Bool` 字段组成的结构体 |
| `resource` | 具有方法和 `drop()` 的句柄结构体 |

名称按 Puddi 约定转换。WIT 记录 `entry` 变成结构体 `Entry`，枚举成员 `info` 变成变体 `Level.Info`，函数和字段用 `snake_case`。通过导入名访问这些类型，如 `log.Entry`。

## 绑定生成

编译器把绑定生成成 Puddi 代码，负责按规范 ABI 接收和传递值，并与程序一起编译。`pud check` 能像检查普通调用一样检查 WIT 调用。

## 导出与限制

`export fn` 声明组件导出。在 `plugin` 上，导出要与宿主 world 一致。`wasi:cli/command` 以外的 WASI world 也用此方式实现。

`pud test` 的 JavaScript 宿主不支持调用 WIT 导入。`pud run` 的插件支持范围见[宿主能力](plugins.md#host-capabilities)。0.1 的部分 WIT 类型只能用于导入，详见[已知差异](../reference/conformance.md#known-gaps-in-01)。
