# std.dom

用于访问浏览器文档，仅在 `browser` 目标提供。

```puddi,browser
import std.dom

fn main() {
    let input = dom.create("input")
    input.set_attr("placeholder", "type something")
    let echo = dom.create("p")
    input.on("input", |e| echo.set_text(e.value()))
    let app = dom.query("#app").unwrap_or(dom.body())
    app.append(input)
    app.append(echo)
}
```

## 函数

| 函数 | 含义 |
|---|---|
| `query(selector) -> Option<Element>` | 第一个匹配 CSS 选择器的元素 |
| `query_all(selector) -> List<Element>` | 所有匹配元素 |
| `create(tag) -> Element` | 创建尚未挂载的元素 |
| `body() -> Element` | 文档的 body |
| `set_title(title)` | 设置文档标题 |

## Element

| 方法 | 含义 |
|---|---|
| `text()`、`set_text(s)` | 读取或设置纯文本 |
| `set_html(s)` | 用 HTML 替换内容 |
| `attr(name) -> Option<Str>`、`set_attr(name, value)` | 读取或设置属性 |
| `value()`、`set_value(s)` | 读取或设置表单控件的值 |
| `add_class(c)`、`remove_class(c)`、`toggle_class(c)` | 管理 CSS 类 |
| `set_style(property, value)` | 设置内联样式 |
| `append(child)`、`remove()` | 添加子元素或移除自身 |
| `query(selector) -> Option<Element>` | 第一个匹配的后代元素 |
| `on(event, f)` | 每次事件发生时把 `Event` 传给 `f` |

## Event

| 方法 | 含义 |
|---|---|
| `kind()` | 事件类型，例如 `click` |
| `target()` | 事件目标元素 |
| `key()` | 键盘事件的键名，其他事件为空字符串 |
| `value()` | 输入事件目标元素的值，其他事件为空字符串 |
| `prevent_default()` | 取消浏览器的默认行为 |
