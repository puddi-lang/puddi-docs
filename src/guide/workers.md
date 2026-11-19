# Workers

Puddi has no shared-memory threads, since WasmGC objects cannot yet be shared between threads. Parallel work runs in workers instead: each worker is a separate WebAssembly instance with its own heap, and it talks to its parent only through messages.

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

- A worker is started with `s.worker(f)` inside a [task scope](async.md) and is terminated when the scope ends.
- `f` must be a top-level async function, not a closure, since a closure cannot leave its instance. It receives a `worker.Port<In, Out>`, which receives `In` and sends `Out`.
- The handle returned by `s.worker(f)` is the other end: it sends `In` and receives `Out`. `recv()` returns `None` once the other side is gone.

## `Transfer`

Messages are deep-copied between instances, so a message type must implement `Transfer`. It is implemented for numbers, `Bool`, `Char`, `Str`, tuples, `Option`, `Result` and collections of `Transfer` types, and can be derived with `@derive(Transfer)` for structs and enums whose fields are all `Transfer`. Functions, closures and `dyn` values are never `Transfer`.

## Where workers run

| Target | Workers |
|---|---|
| `browser` | Web Workers (worker threads under Node.js) |
| `wasi` | instances of the same component on other OS threads, through the bundled `puddi:runtime` worker interfaces |
| `plugin` | available when the host world includes the `puddi:runtime` worker interfaces |

The embedded runner of `pud run` implements the `puddi:runtime` interfaces. Other WASI hosts can run a program that uses workers only if they implement them too; see [Targets](../toolchain/targets.md).
