# 包

一个包是同时包含 `pud.toml` 清单和 `src/` 目录的目录。

```sh
pud new hello
cd hello
pud run
```

`pud new` 创建以下结构：

```text
hello/
├── pud.toml
└── src/
    └── main.pud
```

清单示例：

```toml
[package]
name = "hello"
version = "0.1.0"
puddi = "0.1"
```

在包内运行命令时，`pud` 会从当前目录向父目录查找 `pud.toml`。因此 `pud run`、`pud test` 和 `pud build` 通常无需路径参数。

## 模块

每个文件是一个模块，模块名由 `src/` 下的相对路径确定。`src/main.pud` 是程序根模块，库通常用 `src/lib.pud`。`src/geometry.pud` 对应 `geometry`，`src/net/url.pud` 对应 `net.url`。

```puddi,ignore
// src/geometry.pud
pub struct Point {
    pub x: Float
    pub y: Float
}

pub fn distance(a: Point, b: Point) -> Float {
    ((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y)).sqrt()
}
```

```puddi,ignore
// src/main.pud
import geometry
import geometry.{Point}

fn main() {
    let d = geometry.distance(Point { x: 0.0, y: 0.0 }, Point { x: 3.0, y: 4.0 })
    print("{d}")
}
```

声明默认仅在所属模块内可见。使用 `pub` 将它公开。详见[模块](../guide/modules.md)。

## 构建

```sh
pud build                     # target/wasi/hello.wasm
pud build --target browser    # target/browser/hello.wasm and puddi.mjs
pud run --target browser      # build and serve on http://127.0.0.1:8000
```

组件输出到 `target/<target>/`，创建包时生成的 `.gitignore` 已排除 `target/`。各目标的输出文件参见[构建目标](../toolchain/targets.md)。

## 添加依赖

```sh
pud add github.com/someone/lib@1.2
```

命令更新 `pud.toml`，并把解析出的提交记录到 `pud.lock`。请将锁文件纳入版本控制。详见[依赖](../toolchain/dependencies.md)。

## 测试

`test` 块可以与被测代码放在同一个文件中：

```puddi
fn add(a: Int, b: Int) -> Int { a + b }

test "addition" {
    assert_eq(add(2, 2), 4)
}
```

`pud test` 编译并执行测试，每个测试都在新的实例中运行。详见[测试](../guide/testing.md)。
