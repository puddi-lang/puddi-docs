# 字符串与字符

## Str

`Str` 是不可变的 Unicode 字符串。字面量使用双引号，花括号内可插入实现了 `Show` 的表达式。普通花括号写作 `\{` 和 `\}`。

```puddi
fn main() {
    let name = "Ada"
    let unread = 2
    print("hi {name}, you have {unread + 1} messages")
    print("a literal \{brace\}")
    print("tab\tnewline\\n quote\" smile \u{1F600}")
}
```

```text,output
hi Ada, you have 3 messages
a literal {brace}
tab	newline\n quote" smile 😀
```

支持的转义为 `\n` `\r` `\t` `\0` `\\` `\"` `\'` `\{` `\}` `\u{...}`。

## 字符串长度与索引

字节数、码点数和可见字符数有不同含义。`Str` 不提供整数索引或通用的 `len()`，请明确选择要计算的单位。

```puddi
fn main() {
    let s = "héllo👋🏽"
    print("{s.utf8_len()} bytes")
    print("{s.chars().count()} code points")
    print("{s.graphemes().count()} graphemes")
}
```

```text,output
14 bytes
7 code points
6 graphemes
```

`chars()` 遍历 Unicode 码点，产生 `Char`。`graphemes()` 按字素簇遍历，产生 `Str`。0.1 的字素分割是近似实现，详见[实现状态](../reference/status.md)。

## 查找与切片

字符串位置用 `StrIndex` 表示。从 `find`、`rfind`、`start()`、`end()` 取得索引，或用 `advance(i, n)` 与 `next_index(i)` 按码点移动。索引只适用于生成它的字符串。

```puddi
fn main() {
    let line = "key=value"
    match line.find("=") {
        Some(i) -> {
            print(line.slice_to(i))
            let after = line.advance(i, 1).unwrap()
            print(line.slice_from(after))
        }
        None -> print("no =")
    }
    if let Some((k, v)) = line.split_once("=") {
        print("{k} -> {v}")
    }
}
```

```text,output
key
value
key -> value
```

## 常用方法

```puddi
fn main() {
    let s = "  Hello, World  "
    let t = s.trim()
    print(t.to_lower())
    print("{t.contains("World")} {t.starts_with("He")} {t.ends_with("!")}")
    print(t.replace("World", "Puddi"))
    print("{"a,b,,c".split(",")}")
    print("{"one two  three".split_whitespace()}")
    print(["x", "y", "z"].join("-"))
    print("ab".repeat(3))
}
```

```text,output
hello, world
true true false
Hello, Puddi
["a", "b", "", "c"]
["one", "two", "three"]
x-y-z
ababab
```

还有 `lines`、`trim_start`、`trim_end`、`rfind`、`slice`、`is_empty`、`parse_int`、`parse_float` 和 `to_bytes` 等方法。`+` 可连接两个字符串。

## 拼接字符串

用 `StrBuilder` 逐段构建字符串。

```puddi
fn main() {
    let b = StrBuilder.new()
    for i in 0..3 {
        b.push("item {i};")
    }
    b.push_char('!')
    print(b.to_str())
}
```

```text,output
item 0;item 1;item 2;!
```

## Char

`Char` 是一个 Unicode 标量值，使用单引号，例如 `'a'`、`'\n'` 或 `'\u{1F600}'`。

```puddi
fn main() {
    let c = 'q'
    print("{c.is_alpha()} {c.to_upper()} {c.to_u32()} {'7'.to_digit(10)}")
}
```

```text,output
true Q 113 Some(7)
```

Puddi 0.1 的大小写转换仅覆盖 ASCII。
