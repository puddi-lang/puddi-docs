# std.time and std.random

Both modules are available on `browser` and `wasi`, and on `plugin` when the world imports the WASI clocks or random interfaces.

## std.time

| Item | Meaning |
|---|---|
| `now_ms() -> Float` | milliseconds since the Unix epoch |
| `monotonic_ms() -> Float` | milliseconds from an arbitrary fixed point; only differences are meaningful |
| `utc_offset_minutes() -> Int` | the local time zone's offset from UTC |
| `Instant.now()`, `instant.elapsed_ms()` | measure a duration |
| `sleep(ms)` | async: suspend the current task for at least `ms` milliseconds |
| `yield_now()` | async: let other tasks run before continuing |

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

| Item | Meaning |
|---|---|
| `float() -> Float` | a random float in `[0, 1)` |
| `int(lo, hi) -> Int` | a random integer in `[lo, hi)` |
| `bool() -> Bool` | a random boolean |
| `choice(xs) -> Option<T>` | a random element, or `None` for an empty list |
| `shuffle(xs)` | shuffle a list in place |
| `Rng.new(seed)` | a small deterministic generator (xorshift64*) with `next_u64`, `float` and `int` |

The module functions draw from the host's random source. Use `Rng` when a run must be reproducible:

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
