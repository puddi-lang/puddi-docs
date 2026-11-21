# 异步与任务

## 异步函数

用 `async fn` 编写需要等待计时器、网络或另一个任务的代码，用后缀 `.await` 等待结果。异步函数、异步闭包和测试体可以使用 `.await`，入口 `main` 也可以声明为异步函数。

```puddi
import std.time

async fn slow_square(x: Int) -> Int {
    time.sleep(10).await
    x * x
}

async fn main() {
    let a = slow_square(3).await
    let b = slow_square(4).await
    print("{a + b}")
}
```

```text,output
25
```

`.await` 与方法调用的绑定强度相同。`fetch(url).await?` 先等待结果，再用 `?` 传播错误。

## 结构化并发

并发任务在任务作用域内启动。`task.scope` 接收一个异步闭包，并将作用域作为参数传入。`s.spawn(future)` 启动子任务并返回可等待的句柄。作用域会等所有子任务结束后才退出，因此任务不会超出启动它的代码范围。

```puddi
import std.time

async fn job(name: Str, ms: Int) -> Str {
    time.sleep(ms).await
    print("{name} done")
    name
}

async fn main() {
    let names = task.scope(async |s| {
        let slow = s.spawn(job("slow", 200))
        let fast = s.spawn(job("fast", 10))
        [slow.await, fast.await]
    }).await
    print("{names}")
}
```

```text,output
fast done
slow done
["slow", "fast"]
```

两个任务同时等待，后启动的短任务先结束。

## 取消

子任务失败，或作用域主体通过 `return`、错误上的 `?` 等方式提前退出时，其余任务会被取消。取消是协作式的，任务到达下一处 `.await` 时停止。长时间执行的同步循环可主动检查 `task.is_cancelled()`。

```puddi
import std.time

async fn step(n: Int) -> Result<Int, Str> {
    time.sleep(n * 50).await
    if n == 2 { return Err("step {n} failed") }
    print("step {n} ok")
    Ok(n)
}

async fn run() -> Result<Int, Str> {
    task.scope(async |s| {
        let a = s.spawn(step(1))
        let b = s.spawn(step(2))
        let c = s.spawn(step(5))
        Ok(a.await? + b.await? + c.await?)
    }).await
}

async fn main() {
    print("{run().await}")
}
```

```text,output
step 1 ok
Err("step 2 failed")
```

`b.await?` 把错误返回给作用域时，正在休眠的 `step(5)` 被取消，因此不输出。

## 异步闭包与方法

闭包可以是异步的，例如 `async |url| { fetch(url).await }`。特征方法也可以声明为 `async fn`，包括通过 `dyn Trait` 调用的方法。异步函数值的类型写作 `async fn(Int) -> Str`。

## 宿主调度

在 `wasi` 上，每个子任务运行于自己的组件模型线程，阻塞的 WASI 调用只挂起当前任务。浏览器、Node.js 和 `pud test` 的 JavaScript 宿主用 JSPI 调度。同一个实例里的任务共享堆，但不同时执行 Puddi 代码。需要并行计算时请使用[工作线程](workers.md)。
