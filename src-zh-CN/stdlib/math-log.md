# std.math 与 std.log

## std.math

提供浮点常量、数学函数和整数辅助函数，所有目标均可用。

| 项 | 含义 |
|---|---|
| `PI`、`E`、`TAU` | 常量 |
| `sqrt` `cbrt` `pow` `exp` `ln` `log2` `log10` | 乘方、开方和对数 |
| `sin` `cos` `tan` `asin` `acos` `atan` `atan2` `hypot` | 三角函数及斜边长 |
| `floor` `ceil` `round` `abs` | 取整与绝对值 |
| `gcd(a, b)`、`lcm(a, b)` | `Int` 的最大公约数、最小公倍数 |

浮点数学函数也可用方法形式调用，`math.sqrt(x)` 等价于 `x.sqrt()`。

```puddi
import std.math

fn main() {
    let r = 2.0
    print("{math.PI * r * r}")
    print("{math.hypot(3.0, 4.0)} {math.gcd(12, 18)} {math.lcm(4, 6)}")
}
```

```text,output
12.566370614359172
5.0 6 12
```

## std.log

`debug`、`info`、`warn`、`error` 分别记录不同级别的日志，参数类型都是 `Str`。WASI 写到标准错误流，浏览器写到控制台，插件通过 `wasi:logging/logging` 写到宿主。插件的 world 未导入该接口时，日志会被丢弃。

```puddi
import std.log

fn main() {
    log.info("starting")
    log.warn("disk almost full")
}
```
