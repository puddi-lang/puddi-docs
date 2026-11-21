# 各目标可用的模块

标准模块用 `import std.<name>` 导入。模块须由当前构建目标提供。

| 模块 | 用途 | browser | wasi | plugin |
|---|---|---|---|---|
| [`std.json`](json.md) | JSON 值、解析与序列化 | 是 | 是 | 是 |
| [`std.log`](math-log.md#stdlog) | 分级日志 | 是 | 是 | 是 |
| [`std.math`](math-log.md#stdmath) | 数学常量和函数 | 是 | 是 | 是 |
| [`std.time`](time-random.md#stdtime) | 时钟和休眠 | 是 | 是 | 依赖宿主 |
| [`std.random`](time-random.md#stdrandom) | 随机数 | 是 | 是 | 依赖宿主 |
| [`std.http`](http.md) | HTTP 客户端 | 是 | 是 | 依赖宿主 |
| [`std.worker`](../guide/workers.md) | 并行工作线程 | 是 | 依赖宿主 | 依赖宿主 |
| [`std.io`](system.md#stdio) | 标准输入与输出 | — | 是 | — |
| [`std.fs`](system.md#stdfs) | 文件和目录 | — | 是 | — |
| [`std.env`](system.md#stdenv) | 参数、环境变量和退出 | — | 是 | — |
| [`std.dom`](dom.md) | 浏览器文档 | 是 | — | — |

“依赖宿主”表示目标 world 须包含相应[接口](../interop/plugins.md#host-capabilities)。在 `wasi` 上，`std.worker` 使用内嵌运行时提供的 `puddi:runtime` 接口。插件的 `std.log` 在 world 包含日志接口时写入宿主，否则不输出。

这些模块用 Puddi 编写，见[标准库源码](https://github.com/puddi-lang/puddi/tree/v0.1.1/std)。
