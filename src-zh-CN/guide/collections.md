# 集合

| 类型 | 构造方式 | 说明 |
|---|---|---|
| `List<T>` | `[1, 2, 3]` | 可增长数组 |
| `Map<K, V>` | `["a": 1, "b": 2]`，空映射写作 `[:]` | 键需要 `Eq + Hash`，按插入顺序迭代 |
| `Set<T>` | `Set.from([1, 2, 3])` | 元素需要 `Eq + Hash`，按插入顺序迭代 |

## 列表

```puddi
fn main() {
    let xs = [3, 1, 2]
    xs.push(5)
    print("{xs} has {xs.len()} items, first {xs[0]}")
    print("{xs.get(10)} {xs.first()} {xs.pop()}")
    xs[1] = 10
    print("{xs.sorted()} {xs.contains(10)} {xs.index_of(2)}")
}
```

```text,output
[3, 1, 2, 5] has 4 items, first 3
None Some(3) Some(5)
[2, 3, 10] true Some(2)
```

`xs[i]` 越界时触发陷阱，`xs.get(i)` 则返回 `Option`。

`map`、`filter` 等列表方法返回新列表：

```puddi
fn main() {
    let words = ["apple", "fig", "banana", "kiwi"]
    let short = words.filter(|w| w.chars().count() <= 4)
    let shout = short.map(|w| w.to_upper())
    let total = words.fold(0, |acc, w| acc + w.chars().count())
    print("{short} {shout} {total}")
    print("{words.any(|w| w.starts_with("b"))} {words.find(|w| w.ends_with("i"))}")
    print("{[1, 2, 3].sum()} {[4, 9, 2].max()}")
    for (i, w) in words.enumerate() {
        if i < 2 { print("{i}: {w}") }
    }
}
```

```text,output
["fig", "kiwi"] ["FIG", "KIWI"] 18
true Some("kiwi")
6 Some(9)
0: apple
1: fig
```

`sort`、`sort_by` 和 `sort_by_key` 原地排序。`sorted` 和 `reversed` 分别返回排序或反转后的副本。

## 映射

```puddi
fn main() {
    let ages = ["ada": 36, "alan": 41]
    ages["grace"] = 85
    ages.insert("ada", 37)
    print("{ages["ada"]} {ages.get("bob")} {ages.get_or("bob", 0)}")
    print("{ages.contains_key("alan")} {ages.len()}")
    for (name, age) in ages {
        print("{name} is {age}")
    }
    ages.remove("alan")
    print("{ages.keys()}")
}
```

```text,output
37 None 0
true 3
ada is 37
alan is 41
grace is 85
["ada", "grace"]
```

键不存在时，`m[k]` 会触发陷阱，`m.get(k)` 返回 `Option`。遍历映射会按插入顺序得到 `(key, value)` 元组。

## 集合

```puddi
fn main() {
    let a = Set.from([1, 2, 3])
    let b = Set.from([2, 3, 4])
    a.insert(3)
    print("{a.len()} {a.contains(2)}")
    print("{a.union(b).to_list()} {a.intersection(b).to_list()} {a.difference(b).to_list()}")
}
```

```text,output
3 true
[1, 2, 3, 4] [2, 3] [1]
```

## 只读视图

通过集合自身的类型可以修改集合。如果函数只需读取，请用 `ListView<T>`、`MapView<K, V>` 或 `SetView<T>`。集合可隐式转成视图，视图仅提供读取方法。

```puddi
fn count_long(words: ListView<Str>) -> Int {
    words.filter(|w| w.chars().count() > 3).len()
}

fn main() {
    let words = ["tea", "coffee", "water"]
    print("{count_long(words)}")
}
```

```text,output
2
```

## 区间与迭代器

`a..b` 是右端不包含的区间，`a..=b` 包含右端。区间、列表、映射和集合都能用于 `for`。`.iter()` 返回惰性迭代器，支持 `map`、`filter`、`take`、`skip`、`zip`、`chain`、`enumerate`、`collect` 等操作。

```puddi
fn main() {
    let squares = (1..=10).iter().map(|n| n * n).filter(|n| n % 2 == 0).take(3).to_list()
    print("{squares}")
    print("{(0..5).count()} {(0..5).contains(5)}")
}
```

```text,output
[4, 16, 36]
5 false
```
