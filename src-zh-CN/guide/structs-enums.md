# 结构体与枚举

## 结构体

```puddi
@derive(Show)
struct Point {
    x: Int
    var y: Int
}

fn main() {
    let p = Point { x: 1, y: 2 }
    p.y = 5
    let x = 10
    let y = 20
    let q = Point { x, y }
    let r = Point { x: 7, ..p }
    print("{p} {q} {r}")
}
```

```text,output
Point { x: 1, y: 5 } Point { x: 10, y: 20 } Point { x: 7, y: 5 }
```

- 字段使用换行或逗号分隔
- 只有 `var` 字段在对象构造之后还可重新赋值，其余字段对应 WasmGC 不可变字段
- `Point { x, y }` 是 `Point { x: x, y: y }` 的简写，`..p` 从 `p` 读取其余字段
- 字段默认仅在模块内可见，可用 `pub` 公开

给未声明为 `var` 的字段重新赋值会导致编译错误。

```puddi,fail
struct Point {
    x: Int
    var y: Int
}

fn main() {
    let p = Point { x: 1, y: 2 }
    p.x = 5
}
```

结构体也可使用泛型。

```puddi
struct Pair<A, B> { a: A, b: B }

fn main() {
    let p = Pair { a: 1, b: "one" }
    print("{p.a} {p.b}")
}
```

```text,output
1 one
```

## 枚举

枚举是代数数据类型。变体可以不带值，也可带元组字段或具名字段。用 `Shape.Circle` 这样的路径引用变体。

```puddi
enum Shape {
    Circle(Float)
    Rect { w: Float, h: Float }
    Empty
}

fn area(s: Shape) -> Float {
    match s {
        Shape.Circle(r) -> 3.14 * r * r
        Shape.Rect { w, h } -> w * h
        Shape.Empty -> 0.0
    }
}

fn main() {
    let shapes = [Shape.Circle(1.0), Shape.Rect { w: 2.0, h: 3.0 }, Shape.Empty]
    for s in shapes { print("{area(s)}") }
}
```

```text,output
3.14
6.0
0.0
```

`Option` 和 `Result` 也是枚举。预导入项提供 `Some`、`None`、`Ok`、`Err`，所以它们可以不带路径使用。

## 元组和单元类型

元组将多个值组合而无需命名，例如 `(Int, Str)`。用 `(1, "a")` 构造，用 `.0`、`.1` 读取字段。单元类型 `()` 只有一个值，写作 `()`。

```puddi
fn min_max(xs: List<Int>) -> (Int, Int) {
    (xs.min().unwrap(), xs.max().unwrap())
}

fn main() {
    let t = min_max([4, 1, 7])
    let (lo, hi) = t
    print("{t.0} {t.1} {lo} {hi}")
}
```

```text,output
1 7 1 7
```

## 派生特征

`@derive` 为内建特征生成实现，支持 `Eq`、`Ord`、`Hash`、`Show` 和 `Transfer`。

```puddi
@derive(Eq, Ord, Hash, Show)
struct Version { major: Int, minor: Int }

fn main() {
    let a = Version { major: 1, minor: 2 }
    let b = Version { major: 1, minor: 10 }
    print("{a < b} {a == b} {[b, a].sorted()}")
    let seen = Set.from([a, b, a])
    print("{seen.len()}")
}
```

```text,output
true false [Version { major: 1, minor: 2 }, Version { major: 1, minor: 10 }]
2
```

`Ord` 按字段声明顺序比较。实现 `Transfer` 的值可发给[工作线程](workers.md)。

## 类型别名

```puddi
type UserId = Int
type Callback<T> = fn(T) -> ()

fn notify(id: UserId, cb: Callback<UserId>) { cb(id) }

fn main() {
    notify(7, |id| print("user {id}"))
}
```

```text,output
user 7
```

别名为原类型提供另一个名称，类型本身保持一致。
