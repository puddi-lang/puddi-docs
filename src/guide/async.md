# Async and tasks

## Async functions

Code that waits (for a timer, the network, another task) is written as an `async fn` and awaited with postfix `.await`. Async functions are colored: only async functions, async closures and test bodies can use `.await`. `main` can be `async`.

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

`.await` binds as tightly as a method call, so `fetch(url).await?` awaits and then applies `?`.

## Structured concurrency

Tasks run concurrently only inside a scope. `task.scope` takes an async closure that receives the scope; `s.spawn(future)` starts a child task and returns a handle to await. The scope finishes only when all its children have finished, so no task outlives the code that started it. There is no free-standing `spawn`.

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

Both jobs sleep at the same time: the fast one finishes first even though it was started second.

## Cancellation

If a child fails, or the scope's body finishes early (by returning, or with `?` on an error), the remaining children are cancelled. Cancellation is cooperative: a cancelled task stops at its next `.await` and does not resume after it. A long synchronous loop can check `task.is_cancelled()` itself.

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

`step(5)` never prints: when `b.await?` returns the error, the scope ends and cancels it while it sleeps.

## Async closures and methods

Closures can be async (`async |url| { fetch(url).await }`), and trait methods can be `async fn`, including methods called through `dyn Trait`. The type of an async function value is written `async fn(Int) -> Str`.

## How it runs

On the `wasi` target, every spawned task runs on its own Component Model thread, and a blocking WASI call suspends only the task that made it. On the JavaScript host (browser, Node.js and `pud test`), tasks are scheduled with JSPI. Either way, tasks in one instance share its heap but never run Puddi code at the same moment; use [workers](workers.md) for parallelism.
