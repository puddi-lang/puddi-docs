# std.io, std.fs and std.env

These modules give a `wasi` program access to its process: standard streams, files and the environment. They exist only on the `wasi` target.

## std.io

| Function | Meaning |
|---|---|
| `read_line() -> Option<Str>` | one line of standard input without its line ending; `None` at the end of input |
| `read_all() -> Str` | all remaining standard input |
| `write(s)` | write to standard output without a newline |
| `ewrite(s)` | write to standard error without a newline |

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

Paths are resolved against the directories the host makes available; `pud run` gives the program the current directory.

| Function | Meaning |
|---|---|
| `read(path) -> Result<Str, IoErr>` | the whole file as a string |
| `write(path, content) -> Result<(), IoErr>` | create or replace a file |
| `append(path, content) -> Result<(), IoErr>` | append to a file, creating it if needed |
| `exists(path) -> Bool` | whether the path exists |
| `is_dir(path) -> Bool` | whether the path is a directory |
| `remove(path) -> Result<(), IoErr>` | delete a file or an empty directory |
| `list_dir(path) -> Result<List<Str>, IoErr>` | the names in a directory |
| `create_dir(path) -> Result<(), IoErr>` | create a directory |

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

`IoErr` implements `Show` and `Error`, and has the variants `NotFound`, `PermissionDenied`, `AlreadyExists` and `Other`, each carrying a message.

## std.env

| Function | Meaning |
|---|---|
| `args() -> List<Str>` | command-line arguments; the first is the program name |
| `get(name) -> Option<Str>` | an environment variable |
| `exit(code)` | exit immediately with a status code |

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
