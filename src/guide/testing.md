# Testing

`test` blocks can appear in any file, next to the code they test. They are compiled only by `pud test`, which runs every test in a fresh instance, so tests cannot affect each other.

```puddi
fn fizz(n: Int) -> Str {
    match (n % 3, n % 5) {
        (0, 0) -> "FizzBuzz"
        (0, _) -> "Fizz"
        (_, 0) -> "Buzz"
        _ -> "{n}"
    }
}

test "multiples of three" {
    assert_eq(fizz(9), "Fizz")
}

test "multiples of both" {
    assert_eq(fizz(30), "FizzBuzz")
    assert(fizz(7) == "7")
}
```

```sh
pud test                 # all tests in the package
pud test fizz.pud        # tests in one file
pud test . "multiples"   # tests in the package whose name contains "multiples"
```

A test fails when it panics, which includes a failed `assert`, `assert_eq`, `assert_ne` or `assert_msg`. `assert_eq` prints both values when they differ.

## Async tests

Test bodies may use `.await`:

```puddi
import std.time

async fn slow_double(x: Int) -> Int {
    time.sleep(1).await
    x * 2
}

test "async code" {
    assert_eq(slow_double(21).await, 42)
}
```

## Where tests run

`pud test` runs tests on the JavaScript host and needs Node.js 22 or newer. Because of that, tests cannot call WIT imports. Put code that talks to WIT interfaces behind a function you can replace in tests, or cover it with a small program run by `pud run`.
