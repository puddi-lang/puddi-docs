# 模块

每个文件是一个模块。模块路径与 `src/` 下的文件路径对应。

| 文件 | 模块 |
|---|---|
| `src/main.pud` | 程序根模块 |
| `src/lib.pud` | 库根模块 |
| `src/parser.pud` | `parser` |
| `src/net/http.pud` | `net.http` |

## 导入

```puddi,ignore
import net.http                   // use as http.get(...)
import net.http.{get, Request}    // import specific names
import net.http as h              // alias
import json                       // a dependency named in pud.toml
import std.fs                     // a standard library module
import wasi:clocks/system-clock   // a WIT interface, see Host interop
```

导入后可用模块路径最后一段或别名访问它，例如 `http.get`。同一个包内的模块可以循环导入，包之间的依赖不能成环。

## 可见性

声明和结构体字段默认只在所属模块内可见。标为 `pub` 后，其他模块和包可访问。

```puddi,ignore
// src/account.pud
pub struct Account {
    pub owner: Str
    var balance: Int          // private: only this module can read or set it
}

impl Account {
    pub fn open(owner: Str) -> Account { Account { owner, balance: 0 } }
    pub fn deposit(self, amount: Int) { self.balance += amount }
    pub fn balance(self) -> Int { self.balance }
}
```

```puddi,ignore
// src/main.pud
import account.{Account}

fn main() {
    let a = Account.open("ada")
    a.deposit(10)
    print("{a.owner} has {a.balance()}")
    // a.balance = 99 would not compile: the field is private
}
```

`export` 把函数公开为编译后组件的导出，规则见[插件](../interop/plugins.md)。

## 特定目标的代码

`@target` 只在构建指定目标时保留该声明。

```puddi,ignore
@target(wasi)
fn home() -> Str { "terminal" }

@target(browser, plugin)
fn home() -> Str { "embedded" }
```

## 标准库

`std` 模块使用同样的导入语法。导入当前目标不提供的模块会导致编译错误。详见[各目标可用的模块](../stdlib/modules.md)。
