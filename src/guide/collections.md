# Collections

| Type | Literal | Notes |
|---|---|---|
| `List<T>` | `[1, 2, 3]` | growable array |
| `Map<K, V>` | `["a": 1, "b": 2]`, empty `[:]` | keys need `Eq + Hash`; keeps insertion order |
| `Set<T>` | `Set.from([1, 2, 3])` | elements need `Eq + Hash`; keeps insertion order |

## Lists

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

`xs[i]` traps when `i` is out of bounds; `xs.get(i)` returns an `Option` instead.

Lists have the usual functional methods, which return new lists:

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

Sorting in place uses `sort`, `sort_by` and `sort_by_key`; `sorted` and `reversed` return a sorted or reversed copy.

## Maps

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

`m[k]` traps when the key is missing; `m.get(k)` returns an `Option`. Iterating a map yields `(key, value)` tuples in insertion order.

## Sets

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

## Read-only views

Every collection is mutable through its own type. When a function should only read, take a view: `ListView<T>`, `MapView<K, V>` or `SetView<T>`. A collection converts to its view implicitly, and a view has no methods that modify.

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

## Ranges and iterators

`a..b` is a half-open range and `a..=b` an inclusive one. Ranges, lists, maps and sets can all be used in `for` loops. `.iter()` gives a lazy iterator with `map`, `filter`, `take`, `skip`, `zip`, `chain`, `enumerate` and `collect`:

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
