# 预导入项

每个模块无需 `import` 就可以使用下列名称。

| 类别 | 名称 |
|---|---|
| 类型 | `Bool`、`Int`、`Float` 及各位宽的数值类型、`Char`、`Str`、`StrBuilder`、`List`、`Map`、`Set`、`ListView`、`MapView`、`SetView`、`Option`、`Result`、`AnyErr` |
| 变体 | `Some`、`None`、`Ok`、`Err` |
| 特征 | `Eq`、`Ord`、`Hash`、`Show`、`From`、`Error`、`Transfer`、`Add`、`Sub`、`Mul`、`Div`、`Rem`、`Neg`、`Not`、`Index`、`Iterable`、`Iterator` |
| 函数 | `print`、`eprint`、`panic`、`assert`、`assert_msg`、`assert_eq`、`assert_ne`、`same`、`min`、`max`、`todo` |
| 值 | `task`，用于[任务作用域](../guide/async.md) |

预导入项使用 Puddi 编写，参见[实现源码](https://github.com/puddi-lang/puddi/blob/v0.1.1/src/prelude.pud)。

## 函数

| 函数 | 含义 |
|---|---|
| `print(x)` | 输出值与换行，WASI 用标准输出，浏览器用控制台，插件用日志 |
| `eprint(x)` | 将同样的内容写到标准错误流 |
| `panic(msg)` | 报告无法恢复的错误并停止执行 |
| `assert(cond)`、`assert_msg(cond, msg)` | 条件为假时 panic |
| `assert_eq(a, b)`、`assert_ne(a, b)` | 不满足相等或不等要求时打印两值并 panic |
| `same(a, b)` | 两个引用是否指向同一对象 |
| `min(a, b)`、`max(a, b)` | 取两个 `Ord` 值中较小或较大的一个 |
| `todo()` | 以 `not yet implemented` 为消息触发 panic，可用在任何类型的位置 |

## 常用类型的方法

以下清单可用于查找方法名。用法见[语言指南](../guide/bindings.md)。

**`Option<T>`:** `is_some` `is_none` `unwrap` `expect` `unwrap_or` `unwrap_or_else` `map` `and_then` `or` `or_else` `filter` `ok_or` `ok_or_else` `to_list`

**`Result<T, E>`:** `is_ok` `is_err` `ok` `err` `unwrap` `unwrap_err` `expect` `unwrap_or` `unwrap_or_else` `map` `map_err` `and_then`

**`Str`:** `utf8_len` `is_empty` `chars` `graphemes` `start` `end` `find` `rfind` `contains` `starts_with` `ends_with` `slice` `slice_from` `slice_to` `next_index` `advance` `split_once` `split` `split_whitespace` `lines` `trim` `trim_start` `trim_end` `to_upper` `to_lower` `replace` `repeat` `parse_int` `parse_i64` `parse_float` `to_bytes`, 以及 `Str.from_chars`、`Str.from_utf8`

**`Char`:** `to_u32` `is_digit` `is_alpha` `is_alphanumeric` `is_whitespace` `is_upper` `is_lower` `is_ascii` `to_upper` `to_lower` `to_digit` `to_str`, 以及 `Char.from_u32`

**`StrBuilder`:** `new` `reserve` `push` `push_char` `push_byte` `len` `to_str`

**`List<T>`:** `new` `with_capacity` `filled` `len` `is_empty` `push` `pop` `get` `set` `first` `last` `insert` `remove` `clear` `truncate` `swap` `extend` `concat` `copy` `slice` `take` `skip` `view` `enumerate` `map` `filter` `flat_map` `filter_map` `for_each` `fold` `any` `all` `count` `find` `position` `zip` `reverse` `reversed` `sort` `sort_by` `sort_by_key` `sorted` `contains` `index_of` `min` `max` `dedup`; `List<Str>` 还有 `join`，`Int`、`I64`、`Float` 的列表还有 `sum`

**`Map<K, V>`:** `new` `len` `is_empty` `insert` `get` `get_or` `contains_key` `remove` `clear` `keys` `values` `entries` `view`

**`Set<T>`:** `new` `from` `len` `is_empty` `insert` `contains` `remove` `clear` `to_list` `union` `intersection` `difference` `view`

**视图** (`ListView`, `MapView`, `SetView`): 对应集合的读取方法

**区间** (`a..b`, `a..=b`): `start` `end` `contains` `to_list` `map` `filter` `for_each` `fold` `any` `all` `count` `rev`

**`Iterator`:** `next` `map` `filter` `enumerate` `take` `skip` `zip` `chain` `collect` `to_list` `count` `fold` `for_each` `any` `all` `find` `position` `last` `min` `max`

**`AnyErr`:** `AnyErr.new(e)` `msg` `downcast` `inner`

**数值：** `wrapping_*`、`saturating_*`、`checked_*` 算术方法，`to_<type>()` 窄化转换，`truncate_to_int`、`round_to_int` 等。浮点数还支持 `sqrt` `cbrt` `pow` `exp` `ln` `log2` `log10` `sin` `cos` `tan` `asin` `acos` `atan` `atan2` `hypot` `floor` `ceil` `round` `abs`. 见[数值](../guide/numbers.md)。
