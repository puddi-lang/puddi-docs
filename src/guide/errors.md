# Error handling

Puddi has no null and no exceptions. A value that may be missing is an `Option<T>`; an operation that may fail returns a `Result<T, E>`. Bugs that a program cannot recover from are panics.

## `Option` and `Result`

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

Both have the familiar combinators: `map`, `and_then`, `unwrap_or`, `unwrap_or_else`, `ok_or`, `map_err`, `is_some`, `is_ok` and so on. `unwrap` and `expect` panic on `None` or `Err`.

## The `?` operator

Postfix `?` unwraps `Some` or `Ok`, or returns the `None` or `Err` from the enclosing function:

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

`?` on an `Option` works only in a function that returns `Option`. On a `Result`, when the error type differs from the function's error type, `?` converts it with the `From` trait:

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

## `Error` and `AnyErr`

Error types should implement the `Error` trait, which requires `Show` and has an optional `source` method for error chains. `AnyErr` holds any value that implements `Error`, and since every `Error` converts into it, `?` works with any error type in a function that returns `Result<T, AnyErr>`. Libraries should define their own error types; applications can use `AnyErr` and skip writing `From` impls.

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

`e.downcast<E>()` gets the original error back as an `Option<E>`.

## Errors from `main`

`main` can return `Result<(), E>` for any `E: Show`. When it returns `Err`, the error is printed; a `wasi` program then exits with a failure status, and in a browser the error goes to the console.

## Panics

`panic(msg)` stops the program with an unrecoverable error. So do a failed `assert`, integer overflow, division by zero, indexing out of bounds and `unwrap` on `None` or `Err`. A panic traps the WebAssembly instance and cannot be caught inside Puddi. A plugin's host sees the trap and keeps running; a `wasi` program exits with status 101.

```puddi,ignore
fn main() {
    let xs = [1, 2, 3]
    print("{xs[5]}")       // traps: index out of bounds
}
```

Use panics for bugs, and `Result` for failures a caller might handle.
