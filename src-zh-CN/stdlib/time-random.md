# std.time 与 std.random

两者都适用于 `browser` 和 `wasi`。插件的 world 导入对应的 WASI 接口后也可使用。

## std.time

| 项 | 含义 |
|---|---|
| `now_ms() -> Float` | 自 Unix 纪元起的毫秒数 |
| `monotonic_ms() -> Float` | 从某个固定起点计算的毫秒数，仅差值有意义 |
| `utc_offset_minutes() -> Int` | 本地时区与 UTC 的偏移分钟数 |
| `Instant.now()`、`instant.elapsed_ms()` | 测量一段时长 |
| `sleep(ms)` | 异步挂起当前任务，至少等待 `ms` 毫秒 |
| `yield_now()` | 异步让出执行机会，之后再继续 |

```puddi
import std.time

async fn main() {
    let start = time.Instant.now()
    time.sleep(20).await
    print("{start.elapsed_ms() >= 20.0}")
    print("{time.now_ms() > 1_700_000_000_000.0}")
}
```

```text,output
true
true
```

## std.random

| 项 | 含义 |
|---|---|
| `float() -> Float` | `[0, 1)` 内的随机浮点数 |
| `int(lo, hi) -> Int` | `[lo, hi)` 内的随机整数 |
| `bool() -> Bool` | 随机布尔值 |
| `choice(xs) -> Option<T>` | 随机取一个元素，空列表返回 `None` |
| `shuffle(xs)` | 原地打乱列表 |
| `Rng.new(seed)` | 创建确定性 xorshift64* 生成器，提供 `next_u64`、`float` 和 `int` |

模块函数使用宿主的随机源。需要重现结果时，给 `Rng` 固定的种子。

```puddi
import std.random

fn main() {
    let roll = random.int(1, 7)
    print("{roll >= 1 && roll <= 6}")
    let a = random.Rng.new(42)
    let b = random.Rng.new(42)
    print("{a.int(0, 100) == b.int(0, 100)}")
}
```

```text,output
true
true
```
