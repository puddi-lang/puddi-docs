# 函数与闭包

## 函数

顶层函数要写出参数和返回类型，省略返回类型时默认为 `()`。函数体最后的表达式是返回值，也可以用 `return` 提前退出。

```puddi
fn area(w: Int, h: Int) -> Int {
    let s = w * h
    s
}

fn report(name: Str, value: Int) {
    print("{name}: {value}")
}

fn main() {
    report("area", area(3, 4))
}
```

```text,output
area: 12
```

## 方法

方法在 `impl` 块中声明，第一个参数是 `self`。没有 `self` 的是关联函数，通过类型名称调用。路径分隔符为 `.`。

```puddi
struct Counter {
    var count: Int
}

impl Counter {
    fn new() -> Counter { Counter { count: 0 } }
    fn bump(self, by: Int) { self.count += by }
    fn get(self) -> Int { self.count }
}

fn main() {
    let c = Counter.new()
    c.bump(2)
    c.bump(3)
    print("{c.get()}")
}
```

```text,output
5
```

值是引用，因此方法可直接修改对象中声明为 `var` 的字段，无需另写可变接收者。

## 闭包

闭包写作 `|params| body`。编译器通常可从使用位置推断参数类型。如果先保存闭包，再在别处使用，请给参数注明类型。

```puddi
fn apply_twice(f: fn(Int) -> Int, x: Int) -> Int {
    f(f(x))
}

fn main() {
    let add = |a: Int, b: Int| -> Int { a + b }
    print("{add(2, 3)}")
    print("{apply_twice(|x| x * 10, 3)}")
    print("{[1, 2, 3].map(|x| x + 1)}")
}
```

```text,output
5
300
[2, 3, 4]
```

函数类型写作 `fn(A, B) -> R`。命名函数和闭包都能转换为这一类型。

```puddi
fn double(x: Int) -> Int { x * 2 }

fn main() {
    let ops: List<fn(Int) -> Int> = [double, |x: Int| x + 1]
    for op in ops { print("{op(10)}") }
}
```

```text,output
20
11
```

闭包按引用捕获变量。捕获 `var` 时，可以读到之后的赋值，也可以从闭包内部赋值。

```puddi
fn main() {
    var total = 0
    let add = |x: Int| { total += x }
    add(5)
    add(7)
    print("{total}")
}
```

```text,output
12
```

## 泛型函数

类型参数写在尖括号中，约束跟在 `:` 后面。类型实参通常可在调用处推断，也可以显式写出。

```puddi
fn largest<T: Ord>(xs: List<T>) -> Option<T> {
    var best: Option<T> = None
    for x in xs {
        best = match best {
            Some(b) if b >= x -> Some(b)
            _ -> Some(x)
        }
    }
    best
}

fn main() {
    print("{largest([3, 9, 2])} {largest(["b", "a"])} {largest<Int>([])}")
}
```

```text,output
Some(9) Some("b") None
```

约束的详细规则见[特征与泛型](traits.md)。
