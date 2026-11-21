# std.json

提供 JSON 值、解析与序列化，在所有目标上可用。

```puddi
import std.json
import std.json.{Json}

fn main() {
    let v = json.parse("\{\"name\": \"ada\", \"langs\": [\"en\", \"fr\"], \"age\": 36\}").unwrap()
    print("{v.get("name").and_then(|n| n.as_str())}")
    print("{v.get("langs").and_then(|l| l.at(1))}")
    print("{v.get("age").and_then(|a| a.as_int())} {v.get("missing").is_none()}")

    let out = Json.Object(["ok": Json.Bool(true), "items": Json.Array([Json.Number(1.0), Json.Null])])
    print(json.stringify(out))
}
```

```text,output
Some("ada")
Some("fr")
Some(36) true
{"ok":true,"items":[1,null]}
```

## Json

```puddi,ignore
pub enum Json {
    Null
    Bool(Bool)
    Number(Float)
    String(Str)
    Array(List<Json>)
    Object(Map<Str, Json>)
}
```

对象按插入顺序保存键。`Json` 的显示格式也是 JSON 文本，因此 `"{v}"`、`print(v)` 的结果与 `stringify(v)` 一致。

| 方法 | 返回值 |
|---|---|
| `get(key)` | 对象成员，缺失时为 `None` |
| `at(i)` | 数组元素，缺失时为 `None` |
| `is_null()` | 值是否为 `null` |
| `as_bool()`、`as_float()`、`as_int()`、`as_str()` | 尝试按指定类型读取；`as_int` 要求值为范围内整数 |
| `as_list()`、`as_map()` | 数组的元素或对象的成员 |

## 函数

| 函数 | 含义 |
|---|---|
| `parse(text) -> Result<Json, ParseErr>` | 解析 JSON，`decode` 是同一接口 |
| `stringify(v) -> Str` | 输出紧凑 JSON 文本，`encode` 是同一接口 |

`ParseErr` 公开 `msg` 和表示字节偏移的 `pos`，并实现 `Show` 和 `Error`。可通过 `?` 转成 `AnyErr`。
