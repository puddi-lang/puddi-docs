# std.io、std.fs 和 std.env

标准流、文件系统、命令行参数和环境变量仅由 `wasi` 目标提供。

## std.io

| 函数 | 含义 |
|---|---|
| `read_line() -> Option<Str>` | 读取一行，去掉行尾；输入结束时返回 `None` |
| `read_all() -> Str` | 读取剩余的全部标准输入 |
| `write(s)` | 写到标准输出，无额外换行 |
| `ewrite(s)` | 写到标准错误流，无额外换行 |

```puddi
import std.io

fn main() {
    var lines = 0
    var words = 0
    while let Some(line) = io.read_line() {
        lines += 1
        words += line.split_whitespace().len()
    }
    io.write("{lines} lines, {words} words\n")
}
```

## std.fs

路径在宿主开放的目录中解析。内嵌的 `pud run` 以读写权限开放当前工作目录和 `/`，并继承调用进程环境。运行不熟悉的程序时，可使用只开放所需目录和环境变量的宿主。

| 函数 | 含义 |
|---|---|
| `read(path) -> Result<Str, IoErr>` | 将整个文件读取为字符串 |
| `write(path, content) -> Result<(), IoErr>` | 创建或替换文件 |
| `append(path, content) -> Result<(), IoErr>` | 追加内容，文件不存在时创建 |
| `exists(path) -> Bool` | 路径是否存在 |
| `is_dir(path) -> Bool` | 是否为目录 |
| `remove(path) -> Result<(), IoErr>` | 删除文件或空目录 |
| `list_dir(path) -> Result<List<Str>, IoErr>` | 列出目录中的名称 |
| `create_dir(path) -> Result<(), IoErr>` | 创建目录 |

```puddi
import std.fs

fn main() -> Result<(), AnyErr> {
    fs.write("notes.txt", "first\n")?
    fs.append("notes.txt", "second\n")?
    let text = fs.read("notes.txt")?
    print("{text.lines()}")
    fs.remove("notes.txt")?
    print("{fs.exists("notes.txt")}")
    match fs.read("missing.txt") {
        Ok(_) -> print("found it")
        Err(fs.IoErr.NotFound(_)) -> print("missing.txt does not exist")
        Err(e) -> print("{e}")
    }
    Ok(())
}
```

```text,output
["first", "second"]
false
missing.txt does not exist
```

`IoErr` 实现 `Show` 和 `Error`，有 `NotFound`、`PermissionDenied`、`AlreadyExists`、`Other` 四种变体，各带一条消息。

## std.env

| 函数 | 含义 |
|---|---|
| `args() -> List<Str>` | 命令行参数，第一项是程序名 |
| `get(name) -> Option<Str>` | 读取环境变量 |
| `exit(code)` | 立即以指定状态码退出 |

```puddi
import std.env

fn main() {
    let args = env.args()
    if args.len() < 2 {
        print("usage: {args[0]} <file>")
        env.exit(2)
    }
    print("home is {env.get("HOME").unwrap_or("unknown")}")
}
```
