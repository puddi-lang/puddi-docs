# 第一个 Puddi 程序

## 运行单文件

无需创建包便可运行单个文件。将以下代码保存为 `hello.pud`：

```puddi
fn main() {
    let name = "Puddi"
    print("Hello, {name}!")
}
```

```text,output
Hello, Puddi!
```

运行它：

```sh
pud run hello.pud
```

`pud run` 会先生成 WASI 组件，再用内嵌的 WebAssembly 运行时执行。

- `fn main()` 是入口函数
- `let` 声明一个绑定，此处推断出类型 `Str`
- 双引号字符串可用花括号插入表达式，例如 `"{name}"` 或 `"{1 + 2}"`
- 通常换行结束一条语句，也可以用分号分隔

## 参数与退出状态

通过 `std.env` 读取命令行参数。`main` 可以返回 `Result`，返回 `Err` 时会输出错误并以失败状态退出。

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

`--` 后的内容原样传给程序。`env.args()` 的第一项是程序名。

## 只检查类型

```sh
pud check hello.pud     # type-check only
pud fmt hello.pud       # format in the official style
```

接下来可把单文件变成一个[包](packages.md)。
