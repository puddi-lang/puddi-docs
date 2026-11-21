# 各目标可用的模块

标准模块用 `import std.<name>` 导入。模块须由当前构建目标提供。

| 模块 | 用途 | browser | wasi | plugin |
|---|---|---|---|---|
| [`std.json`](json.md) | JSON 值、解析与序列化 | 是 | 是 | 是 |
| [`std.log`](math-log.md#stdlog) | 分级日志 | 是 | 是 | 是 |
| [`std.math`](math-log.md#stdmath) | 数学常量和函数 | 是 | 是 | 是 |
| `std.bytes` | 字节序转换和有边界检查的二进制读取 | 是 | 是 | 是 |
| `std.collections` | 双端队列、优先队列、分组和计数 | 是 | 是 | 是 |
| `std.csv` | 按 CSV 引号规则处理分隔文本 | 是 | 是 | 是 |
| `std.date` | 公历日期、UTC 时间戳和 Unix 时间转换 | 是 | 是 | 是 |
| `std.encoding` | 十六进制、Base64、Base64url 和百分号编码 | 是 | 是 | 是 |
| `std.fmt` | 值格式化和整数进制转换 | 是 | 是 | 是 |
| `std.iter` | 惰性迭代器来源 | 是 | 是 | 是 |
| `std.path` | 以斜杠分隔的路径文本操作 | 是 | 是 | 是 |
| `std.stats` | 统计摘要、方差、标准差和中位数 | 是 | 是 | 是 |
| `std.text` | 按 Unicode 标量截断和填充，移除前后缀 | 是 | 是 | 是 |
| [`std.time`](time-random.md#stdtime) | 时钟和休眠 | 是 | 是 | 依赖宿主 |
| [`std.random`](time-random.md#stdrandom) | 随机数 | 是 | 是 | 依赖宿主 |
| [`std.http`](http.md) | HTTP 客户端 | 是 | 是 | 依赖宿主 |
| [`std.worker`](../guide/workers.md) | 并行工作线程 | 是 | 依赖宿主 | 依赖宿主 |
| [`std.io`](system.md#stdio) | 标准输入与输出 | — | 是 | — |
| [`std.fs`](system.md#stdfs) | 文件和目录 | — | 是 | — |
| [`std.env`](system.md#stdenv) | 参数、环境变量和退出 | — | 是 | — |
| [`std.dom`](dom.md) | 浏览器文档 | 是 | — | — |

“依赖宿主”表示目标 world 须包含相应[接口](../interop/plugins.md#host-capabilities)。在 `wasi` 上，`std.worker` 使用内嵌运行时提供的 `puddi:runtime` 接口。插件的 `std.log` 在 world 包含日志接口时写入宿主，否则不输出。

详见[便携模块 API 参考](../reference/spec.md#103-portable-modules)和[标准库源码](https://github.com/puddi-lang/puddi/tree/v0.1.2/std)。
