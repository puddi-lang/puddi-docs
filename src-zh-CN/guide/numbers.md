# 数值

| 类型 | 含义 |
|---|---|
| `Int` | 32 位有符号整数，与 `I32` 相同 |
| `I8` `I16` `I32` `I64` | 有符号整数 |
| `U8` `U16` `U32` `U64` | 无符号整数 |
| `Float` | 64 位浮点数，与 `F64` 相同 |
| `F32` `F64` | 浮点数 |

上下文没有要求其他类型时，整数字面量默认为 `Int`，浮点字面量默认为 `Float`。数字可用 `_` 分组，整数可用 `0x`、`0b` 和 `0o` 前缀。超出类型范围的字面量会导致编译错误。

```puddi
fn main() {
    let a = 1_000
    let mask: U8 = 0xFF
    let big: I64 = 3_000_000_000
    let f = 2.5e-3
    print("{a} {mask} {big} {f}")
}
```

```text,output
1000 255 3000000000 0.0025
```

## 溢出与除法

整数溢出、除以零或对零取余会触发[陷阱](errors.md#panics)。整数除法向零截断，余数与被除数同号。

```puddi
fn main() {
    print("{-7 / 2} {-7 % 2}")
    let x: U8 = 250
    print("{x.wrapping_add(10)} {x.saturating_add(10)} {x.checked_add(10)}")
}
```

```text,output
-3 -1
4 255 None
```

需要不同的溢出行为时，可使用 `wrapping_*`、`saturating_*` 或 `checked_*` 方法。

## 隐式拓宽

只要目标类型明确且转换总是无损，就可以隐式拓宽，例如绑定带类型标注、函数实参和返回值、字段初始化及集合元素。

```puddi
fn average(total: Float, n: Float) -> Float { total / n }

fn main() {
    let n: Int = 4
    let wide: I64 = n
    let small: U8 = 200
    print("{average(10, n)} {wide + 1} {small + n}")
}
```

```text,output
2.5 5 204
```

二元运算的数值类型不同时，两边会拓宽到能精确容纳双方的最窄公共类型。`U8 + Int` 的结果为 `Int`。`I64` 与 `U64` 或 `I64` 与 `Float` 没有这样的公共类型，编译会失败。`I64` 和 `U64` 都不会隐式转成浮点数，因为 `F64` 无法精确表示全部 64 位整数。

| 原类型 | 可拓宽到 |
|---|---|
| `I8` | `I16` `I32` `I64` `F32` `F64` |
| `I16` | `I32` `I64` `F32` `F64` |
| `I32` | `I64` `F64` |
| `U8` | `U16` `U32` `U64` `I16` `I32` `I64` `F32` `F64` |
| `U16` | `U32` `U64` `I32` `I64` `F32` `F64` |
| `U32` | `U64` `I64` `F64` |
| `F32` | `F64` |

## 显式窄化

可能丢失信息的转换要调用方法。`to_<type>()` 返回 `Option`，转换失败时为 `None`。`truncate_to_int()` 与 `round_to_int()` 等方法明确指明如何截去小数或取整。

```puddi
fn main() {
    let big: I64 = 5_000_000_000
    let fits: I64 = 42
    print("{big.to_int()} {fits.to_int()}")
    print("{3.7.truncate_to_int()} {3.7.round_to_int()}")
}
```

```text,output
None Some(42)
3 4
```

## 浮点数

浮点类型提供 `sqrt`、`pow`、`abs`、`floor`、`ceil`、`round`、`sin`、`cos`、`ln` 等方法。[std.math](../stdlib/math-log.md) 也提供对应函数和 `math.PI` 等常量。输出保留能还原原数值的最短表示，没有小数部分的浮点数仍保留 `.0`。

```puddi
fn main() {
    let x = 2.0
    print("{x.sqrt()} {0.1 + 0.2} {x.pow(10.0)}")
}
```

```text,output
1.4142135623730951 0.30000000000000004 1024.0
```

## 解析字符串

```puddi
fn main() {
    print("{"42".parse_int()} {"x".parse_int()} {"1.5".parse_float()}")
}
```

```text,output
Some(42) None Some(1.5)
```
