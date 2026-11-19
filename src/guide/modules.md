# Modules

One file is one module. Module paths follow the file layout under `src/`:

| File | Module |
|---|---|
| `src/main.pud` | the root of a program |
| `src/lib.pud` | the root of a library |
| `src/parser.pud` | `parser` |
| `src/net/http.pud` | `net.http` |

## Imports

```puddi,ignore
import net.http                   // use as http.get(...)
import net.http.{get, Request}    // import specific names
import net.http as h              // alias
import json                       // a dependency named in pud.toml
import std.fs                     // a standard library module
import wasi:clocks/system-clock   // a WIT interface, see Host interop
```

An imported module is used through its last path segment (`http.get`) or its alias. Imports between modules of one package may form cycles; dependencies between packages may not.

## Visibility

Declarations and struct fields are private to their module by default. `pub` makes them visible to other modules and to other packages:

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

`export` is separate from `pub`: it marks functions that become exports of the compiled component (see [Plugins](../interop/plugins.md)).

## Code for one target

`@target` keeps a declaration only when building for the listed targets:

```puddi,ignore
@target(wasi)
fn home() -> Str { "terminal" }

@target(browser, plugin)
fn home() -> Str { "embedded" }
```

## The standard library

`std` modules are imported like any other module. Which ones exist depends on the target; importing a module the target does not provide is a compile error. See [Modules by target](../stdlib/modules.md).
