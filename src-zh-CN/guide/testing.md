# 测试

`test` 块可以写在任何源文件中，与被测代码放在一起。`pud test` 才会编译测试，并为每个测试启动一个新实例，避免测试共享状态。

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

发生 panic 时测试失败，包括 `assert`、`assert_eq`、`assert_ne` 或 `assert_msg` 失败。`assert_eq` 比较失败时会输出两个值。

## 异步测试

测试体可直接使用 `.await`。

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

## 测试宿主

`pud test` 在 JavaScript 宿主中运行，需要 Node.js 22 或更新版本。运行异步测试还需要 JSPI，Node.js 24 默认启用它。测试无法调用 WIT 导入，相关代码可以放到可替换的函数后面，或另用 `pud run` 执行小型集成程序。
