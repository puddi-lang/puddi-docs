# 工作线程

WasmGC 对象无法在线程间共享，因此 Puddi 用隔离的工作线程做并行计算。每个工作线程是一个独立 WebAssembly 实例，拥有自己的堆，并通过消息与父实例通信。

```puddi
import std.worker

@derive(Transfer)
struct Job {
    id: Int
    data: List<Int>
}

async fn summer(port: worker.Port<Job, Int>) {
    while let Some(job) = port.recv().await {
        port.send(job.data.sum())
    }
}

async fn main() {
    task.scope(async |s| {
        let w = s.worker(summer)
        w.send(Job { id: 1, data: [1, 2, 3] })
        w.send(Job { id: 2, data: [10, 20] })
        print("{w.recv().await} {w.recv().await}")
    }).await
}
```

```text,output
Some(6) Some(30)
```

- 在[任务作用域](async.md)内用 `s.worker(f)` 启动工作线程，作用域结束时它会终止
- `f` 必须是顶层异步函数，不能使用捕获环境的闭包。它接收 `worker.Port<In, Out>`，读取 `In` 并发送 `Out`
- `s.worker(f)` 返回通道的另一端，发送 `In` 并读取 `Out`。当另一端已退出，`recv()` 返回 `None`

## Transfer

消息在实例间深拷贝，因此消息类型必须实现 `Transfer`。数值、`Bool`、`Char`、`Str` 以及由 `Transfer` 类型组成的元组、`Option`、`Result` 和集合均可传输。当结构体和枚举的字段都可传输时，可用 `@derive(Transfer)` 派生。函数、闭包和 `dyn` 值不能传输。

## 宿主支持

| 目标 | 运行方式 |
|---|---|
| `browser` | Web Workers，Node.js 中使用工作线程 |
| `wasi` | 通过 `puddi:runtime` 接口在其他操作系统线程启动组件实例 |
| `plugin` | 宿主 world 导入 `puddi:runtime` 工作线程接口时可用 |

`pud run` 的内嵌运行时提供 `puddi:runtime` 接口。其他 WASI 宿主需要自行提供才能运行使用工作线程的程序。详见[构建目标](../toolchain/targets.md)。
