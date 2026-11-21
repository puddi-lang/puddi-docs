# 插件

`plugin` 目标根据宿主应用定义的 WIT world 构建。World 描述插件可以调用的导入，以及必须实现的导出。

## 从 WIT 到运行

宿主先公布 WIT world：

```wit
// wit/host.wit
package demo:host;

interface log {
  enum level { info, warn }
  record entry { level: level, message: string }
  write: func(e: entry);
}

world plugin {
  import log;
  export greet: func(name: string, times: u32) -> list<string>;
  export classify: func(n: s64) -> result<string, option<u8>>;
}
```

插件清单引用 world：

```toml
[package]
name = "greeter"
version = "0.1.0"
puddi = "0.1"

[target.plugin]
world = "wit/host.wit#plugin"
```

每个导出由 `export fn` 实现：

```puddi,ignore
// src/main.pud
import demo:host/log

export fn greet(name: Str, times: U32) -> List<Str> {
    log.write(log.Entry { level: log.Level.Info, message: "greeting {name}" })
    let out: List<Str> = []
    for i in 0..times.to_int().unwrap_or(0) {
        out.push("hi {name} {i}")
    }
    out
}

export fn classify(n: I64) -> Result<Str, Option<U8>> {
    if n > 0 { Ok("positive {n}") } else if n == 0 { Err(None) } else { Err(Some(7)) }
}
```

```sh
pud build --target plugin       # target/plugin/greeter.wasm
pud run --target plugin -- classify 5
```

```text
ok("positive 5")
```

缺少导出或函数签名与 world 不一致时会报编译错误。异步 WIT `async func` 应用 `export async fn` 实现，可以在其中创建任务并等待结果。

<a id="host-capabilities"></a>

## 宿主能力

插件可以使用其 world 所提供的标准模块。

| 模块 | world 需要导入的接口 |
|---|---|
| `std.time` | `wasi:clocks/monotonic-clock`、`wasi:clocks/system-clock` |
| `std.random` | `wasi:random/random` |
| `std.http` | `wasi:http/types`、`wasi:http/client` |
| `std.worker` | `puddi:runtime/workers`、`puddi:runtime/port` |
| `std.log`、`print` | `wasi:logging/logging`，没有该接口时不输出日志 |

`pud run --target plugin -- <export> [args]` 通过内嵌运行时调用一个导出。内嵌运行时实现上表的能力。调用 `demo:host/log` 等自定义接口时，需要提供该接口的实际宿主。

## 插件中的 panic

Panic 使插件实例触发陷阱。宿主会收到调用错误，可继续运行。

参见[自定义接口示例](https://github.com/puddi-lang/puddi/tree/main/examples/plugin)和[宿主能力示例](https://github.com/puddi-lang/puddi/tree/main/examples/plugin-host)。
