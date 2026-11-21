# 错误处理

用 `Option<T>` 表示可能缺失的值，用 `Result<T, E>` 表示可失败的操作。无法恢复的程序错误用 panic 终止执行。

## Option 与 Result

```puddi
fn find_user(id: Int) -> Option<Str> {
    if id == 1 { Some("ada") } else { None }
}

fn parse_port(s: Str) -> Result<Int, Str> {
    match s.parse_int() {
        Some(n) if n > 0 && n < 65536 -> Ok(n)
        _ -> Err("bad port: {s}")
    }
}

fn main() {
    print("{find_user(1)} {find_user(2).unwrap_or("nobody")}")
    print("{parse_port("8080")} {parse_port("x")}")
    print("{parse_port("80").map(|p| p + 1)} {find_user(1).is_some()}")
}
```

```text,output
Some("ada") nobody
Ok(8080) Err("bad port: x")
Ok(81) true
```

常用组合方法有 `map`、`and_then`、`unwrap_or`、`unwrap_or_else`、`ok_or`、`map_err`、`is_some` 和 `is_ok`。在 `None` 或 `Err` 上调用 `unwrap` 或 `expect` 会触发 panic。

## 问号运算符

后缀 `?` 从 `Some` 或 `Ok` 中取出值，遇到 `None` 或 `Err` 时从当前函数提前返回。

```puddi
fn add_strings(a: Str, b: Str) -> Option<Int> {
    let x = a.parse_int()?
    let y = b.parse_int()?
    Some(x + y)
}

fn main() {
    print("{add_strings("2", "3")} {add_strings("2", "z")}")
}
```

```text,output
Some(5) None
```

对 `Option` 使用 `?` 时，当前函数须返回 `Option`。对 `Result` 使用 `?` 时，如果错误类型不同，可以通过 `From` 转换。

```puddi
enum AppErr {
    BadNumber(Str)
    TooBig(Int)
}

impl Show for AppErr {
    fn show(self) -> Str {
        match self {
            AppErr.BadNumber(s) -> "not a number: {s}"
            AppErr.TooBig(n) -> "{n} is too big"
        }
    }
}

struct ParseErr { input: Str }

impl From<ParseErr> for AppErr {
    fn from(e: ParseErr) -> AppErr { AppErr.BadNumber(e.input) }
}

fn parse(s: Str) -> Result<Int, ParseErr> {
    s.parse_int().ok_or(ParseErr { input: s })
}

fn check(s: Str) -> Result<Int, AppErr> {
    let n = parse(s)?
    if n > 100 { return Err(AppErr.TooBig(n)) }
    Ok(n)
}

fn main() {
    for s in ["42", "abc", "500"] {
        match check(s) {
            Ok(n) -> print("ok {n}")
            Err(e) -> print("error: {e}")
        }
    }
}
```

```text,output
ok 42
error: not a number: abc
error: 500 is too big
```

## Error 与 AnyErr

错误类型宜实现 `Error`，它要求 `Show` 并提供可选的 `source` 方法来表示错误链。`AnyErr` 可持有任何实现了 `Error` 的值。这类值可自动转成 `AnyErr`，让返回 `Result<T, AnyErr>` 的函数用 `?` 传递这些错误。库可以提供明确的错误类型，应用则可用 `AnyErr` 简化转换。

```puddi
import std.json

struct ConfigErr { msg: Str }

impl Show for ConfigErr {
    fn show(self) -> Str { "config: {self.msg}" }
}

impl Error for ConfigErr {}

fn port(text: Str) -> Result<Int, AnyErr> {
    let v = json.parse(text)?
    let Some(p) = v.get("port").and_then(|p| p.as_int()) else {
        return Err(AnyErr.new(ConfigErr { msg: "no port" }))
    }
    Ok(p)
}

fn main() {
    print("{port("\{\"port\": 8080\}")}")
    match port("\{\}") {
        Ok(_) -> {}
        Err(e) -> {
            print("{e}")
            if let Some(c) = e.downcast<ConfigErr>() { print("message: {c.msg}") }
        }
    }
    match port("nonsense") {
        Ok(_) -> {}
        Err(e) -> print("{e}")
    }
}
```

```text,output
Ok(8080)
config: no port
message: no port
invalid JSON at byte 0: unexpected character
```

`e.downcast<E>()` 尝试取回原始错误，返回 `Option<E>`。

## main 返回错误

当 `E` 实现 `Show` 时，`main` 可以返回 `Result<(), E>`。返回 `Err` 会输出错误，WASI 程序以失败状态退出，浏览器则把错误写入控制台。

<a id="panics"></a>

## Panic

`panic(msg)` 表示程序遇到无法恢复的错误。断言失败、整数溢出、除以零、索引越界或对 `None`、`Err` 解包也会触发 panic。它会使 WebAssembly 实例触发陷阱，Puddi 内部不可捕获。插件宿主会收到陷阱并继续运行，WASI 程序的退出状态是 101。

```puddi,ignore
fn main() {
    let xs = [1, 2, 3]
    print("{xs[5]}")       // traps: index out of bounds
}
```

程序缺陷适合用 panic，调用方能够处理的失败适合用 `Result`。
