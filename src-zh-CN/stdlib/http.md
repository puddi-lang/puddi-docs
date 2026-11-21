# std.http

异步 HTTP 客户端。浏览器目标通过 `fetch` 发送请求，WASI 目标通过 WASI HTTP，插件目标需要宿主提供 HTTP 接口。

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

## 请求

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

| 函数或方法 | 含义 |
|---|---|
| `get(url)`、`post(url, body)` | 发送请求，返回 `Result<Response, HttpErr>` |
| `request(req)` | 发送 `Request` |
| `Request.new(method, url)` | 创建正文为空且没有请求头的请求 |
| `req.header(name, value)` | 返回添加了请求头的副本 |
| `req.with_body(body)` | 返回带新正文的副本 |
| `req.send()` | 发送请求 |

发送操作均为异步函数，需要等待结果。

## 响应

`Response` 公开了 `status: Int` 和 `headers: List<(Str, Str)>`。用 `text()` 或 `json()` 读取正文。

| 方法 | 含义 |
|---|---|
| `ok()` | 状态码是否在 200–299 之间 |
| `header(name)` | 忽略大小写，返回第一个同名响应头 |
| `text()` | 将正文读取为字符串 |
| `json()` | 把正文解析为 [`Json`](json.md) |

## 错误

`HttpErr` 实现了 `Show` 和 `Error`。

| 变体 | 含义 |
|---|---|
| `HttpErr.Network(msg)` | 无法发送请求或没有收到响应 |
| `HttpErr.InvalidUrl(msg)` | 无法解析 URL |
| `HttpErr.Body(msg)` | 正文不符合所需格式，例如 `json()` 遇到无效 JSON |
