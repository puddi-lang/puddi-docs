# Prelude

The prelude is available in every module without an import.

| Kind | Names |
|---|---|
| Types | `Bool`, `Int`, `Float` and the sized numeric types, `Char`, `Str`, `StrBuilder`, `List`, `Map`, `Set`, `ListView`, `MapView`, `SetView`, `Option`, `Result`, `AnyErr` |
| Variants | `Some`, `None`, `Ok`, `Err` |
| Traits | `Eq`, `Ord`, `Hash`, `Show`, `From`, `Error`, `Transfer`, `Add`, `Sub`, `Mul`, `Div`, `Rem`, `Neg`, `Not`, `Index`, `Iterable`, `Iterator` |
| Functions | `print`, `eprint`, `panic`, `assert`, `assert_msg`, `assert_eq`, `assert_ne`, `same`, `min`, `max`, `todo` |
| Values | `task`, for [task scopes](../guide/async.md) |

The prelude is written in Puddi: see [src/prelude.pud](https://github.com/puddi-lang/puddi/blob/main/src/prelude.pud) in the compiler repository.

## Functions

| Function | Meaning |
|---|---|
| `print(x)` | write `x` and a newline to standard output (`wasi`), the console (`browser`) or the log (`plugin`) |
| `eprint(x)` | the same, to standard error |
| `panic(msg)` | stop with an unrecoverable error |
| `assert(cond)`, `assert_msg(cond, msg)` | panic when `cond` is false |
| `assert_eq(a, b)`, `assert_ne(a, b)` | panic, showing both values, when `a != b` (or `a == b`) |
| `same(a, b)` | whether two references point to the same object |
| `min(a, b)`, `max(a, b)` | the smaller or larger of two `Ord` values |
| `todo()` | panic with "not yet implemented"; fits any type |

## Methods by type

The lists below name the methods; the [language guide](../guide/bindings.md) shows them in use.

**`Option<T>`:** `is_some` `is_none` `unwrap` `expect` `unwrap_or` `unwrap_or_else` `map` `and_then` `or` `or_else` `filter` `ok_or` `ok_or_else` `to_list`

**`Result<T, E>`:** `is_ok` `is_err` `ok` `err` `unwrap` `unwrap_err` `expect` `unwrap_or` `unwrap_or_else` `map` `map_err` `and_then`

**`Str`:** `utf8_len` `is_empty` `chars` `graphemes` `start` `end` `find` `rfind` `contains` `starts_with` `ends_with` `slice` `slice_from` `slice_to` `next_index` `advance` `split_once` `split` `split_whitespace` `lines` `trim` `trim_start` `trim_end` `to_upper` `to_lower` `replace` `repeat` `parse_int` `parse_i64` `parse_float` `to_bytes`, and `Str.from_chars`, `Str.from_utf8`

**`Char`:** `to_u32` `is_digit` `is_alpha` `is_alphanumeric` `is_whitespace` `is_upper` `is_lower` `is_ascii` `to_upper` `to_lower` `to_digit` `to_str`, and `Char.from_u32`

**`StrBuilder`:** `new` `reserve` `push` `push_char` `push_byte` `len` `to_str`

**`List<T>`:** `new` `with_capacity` `filled` `len` `is_empty` `push` `pop` `get` `set` `first` `last` `insert` `remove` `clear` `truncate` `swap` `extend` `concat` `copy` `slice` `take` `skip` `view` `enumerate` `map` `filter` `flat_map` `filter_map` `for_each` `fold` `any` `all` `count` `find` `position` `zip` `reverse` `reversed` `sort` `sort_by` `sort_by_key` `sorted` `contains` `index_of` `min` `max` `dedup`; `join` on `List<Str>`; `sum` on lists of `Int`, `I64` and `Float`

**`Map<K, V>`:** `new` `len` `is_empty` `insert` `get` `get_or` `contains_key` `remove` `clear` `keys` `values` `entries` `view`

**`Set<T>`:** `new` `from` `len` `is_empty` `insert` `contains` `remove` `clear` `to_list` `union` `intersection` `difference` `view`

**Views** (`ListView`, `MapView`, `SetView`): the reading methods of their collection

**Ranges** (`a..b`, `a..=b`): `start` `end` `contains` `to_list` `map` `filter` `for_each` `fold` `any` `all` `count` `rev`

**`Iterator`:** `next` `map` `filter` `enumerate` `take` `skip` `zip` `chain` `collect` `to_list` `count` `fold` `for_each` `any` `all` `find` `position` `last` `min` `max`

**`AnyErr`:** `AnyErr.new(e)` `msg` `downcast` `inner`

**Numbers:** arithmetic with `wrapping_*`, `saturating_*` and `checked_*` variants, `to_<type>()` narrowing conversions, `truncate_to_int`, `round_to_int` and friends, and on floats `sqrt` `cbrt` `pow` `exp` `ln` `log2` `log10` `sin` `cos` `tan` `asin` `acos` `atan` `atan2` `hypot` `floor` `ceil` `round` `abs`. See [Numbers](../guide/numbers.md).
