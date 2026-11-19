# Hello, Puddi

## A single file

`pud` can run one file without any project setup. Save this as `hello.pud`:

```puddi
fn main() {
    let name = "Puddi"
    print("Hello, {name}!")
}
```

```text,output
Hello, Puddi!
```

and run it:

```sh
pud run hello.pud
```

`pud run` compiles the file to a WASI component and runs it in the embedded WebAssembly runtime. There is no separate build step to remember: the compiler is fast enough to run on every invocation.

A few things to notice:

- `fn main()` is the entry point of a program.
- `let` introduces a binding. Its type, `Str`, is inferred.
- Strings interpolate any expression in braces: `"{name}"`, `"{1 + 2}"`.
- Statements end at the end of a line. Semicolons are optional.

## Arguments and exit status

Command-line arguments come from `std.env`, and `main` can return a `Result`: when it returns `Err`, the error is printed and the program exits with a failure status.

```puddi
import std.env

fn main() -> Result<(), Str> {
    let args = env.args()
    let Some(who) = args.get(1) else {
        return Err("usage: greet <name>")
    }
    print("Hello, {who}!")
    Ok(())
}
```

```sh
pud run greet.pud -- Ada
```

Everything after `--` is passed to the program; `env.args()` starts with the program name.

## Checking without running

```sh
pud check hello.pud     # type-check only
pud fmt hello.pud       # format in the official style
```

Next, turn the file into a [package](packages.md).
