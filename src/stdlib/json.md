# std.json

JSON values, parsing and serialization. Available on every target.

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

## `Json`

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

Objects keep their keys in insertion order. A `Json` value shows as JSON text, so `"{v}"` and `print(v)` print it in the same form as `stringify`.

| Method | Returns |
|---|---|
| `get(key)` | the member of an object, or `None` |
| `at(i)` | the element of an array, or `None` |
| `is_null()` | whether the value is `null` |
| `as_bool()`, `as_float()`, `as_int()`, `as_str()` | the value, if it has that type (`as_int` needs an integral number in range) |
| `as_list()`, `as_map()` | the elements or members of an array or object |

## Functions

| Function | Meaning |
|---|---|
| `parse(text) -> Result<Json, ParseErr>` | parse JSON text; `decode` is the same |
| `stringify(v) -> Str` | compact JSON text; `encode` is the same |

`ParseErr` has public fields `msg` and `pos` (a byte offset) and implements `Show` and `Error`, so `?` converts it to `AnyErr`.
