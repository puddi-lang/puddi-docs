# std.http

An HTTP client. Available on `browser` (through `fetch`), on `wasi` (through `wasi:http/client`) and on `plugin` when the world imports `wasi:http/types` and `wasi:http/client`.

```puddi
import std.http

async fn main() -> Result<(), http.HttpErr> {
    let res = http.get("https://example.com/").await?
    print("{res.status} {res.ok()} {res.header("content-type")}")
    let body = res.text().await?
    print("{body.utf8_len()} bytes")
    Ok(())
}
```

## Requests

`http.get(url)` and `http.post(url, body)` cover the common cases. For anything else build a `Request`:

```puddi
import std.http

async fn main() -> Result<(), http.HttpErr> {
    let res = http.Request.new("PUT", "https://example.com/items/1")
        .header("content-type", "application/json")
        .with_body("\{\"done\": true\}")
        .send()
        .await?
    print("{res.status}")
    Ok(())
}
```

| Function or method | Meaning |
|---|---|
| `get(url)`, `post(url, body)` | send a request, return `Result<Response, HttpErr>` |
| `request(req)` | send a `Request` |
| `Request.new(method, url)` | a request with no headers and an empty body |
| `req.header(name, value)` | a copy of the request with a header added |
| `req.with_body(body)` | a copy with a body |
| `req.send()` | send it |

All sending functions are `async`.

## Responses

`Response` has the public fields `status` (an `Int`) and `headers` (a `List<(Str, Str)>` of name and value pairs). Read the body with `text()` or `json()`.

| Method | Meaning |
|---|---|
| `ok()` | whether the status is in 200-299 |
| `header(name)` | the first header with this name, compared case-insensitively |
| `text()` | the body as a string |
| `json()` | the body parsed as [`Json`](json.md) |

## Errors

`HttpErr` implements `Show` and `Error`:

| Variant | Meaning |
|---|---|
| `HttpErr.Network(msg)` | the request could not be sent or no response arrived |
| `HttpErr.InvalidUrl(msg)` | the URL could not be parsed |
| `HttpErr.Body(msg)` | the body was not what the caller asked for, such as invalid JSON from `json()` |
