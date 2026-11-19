# std.dom

The browser document. Available only on the `browser` target.

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

## Functions

| Function | Meaning |
|---|---|
| `query(selector) -> Option<Element>` | the first element matching a CSS selector |
| `query_all(selector) -> List<Element>` | all elements matching a CSS selector |
| `create(tag) -> Element` | a new, detached element |
| `body() -> Element` | the document body |
| `set_title(title)` | set the document title |

## `Element`

| Method | Meaning |
|---|---|
| `text()`, `set_text(s)` | the text content |
| `set_html(s)` | replace the content with HTML |
| `attr(name) -> Option<Str>`, `set_attr(name, value)` | attributes |
| `value()`, `set_value(s)` | the value of an input, select or textarea |
| `add_class(c)`, `remove_class(c)`, `toggle_class(c)` | CSS classes |
| `set_style(property, value)` | an inline style property |
| `append(child)`, `remove()` | change the tree |
| `query(selector) -> Option<Element>` | the first matching descendant |
| `on(event, f)` | call `f` with an `Event` each time the event happens |

## `Event`

| Method | Meaning |
|---|---|
| `kind()` | the event type, such as `click` |
| `target()` | the element the event happened on |
| `key()` | the key for keyboard events, or `""` |
| `value()` | the target's value for input events, or `""` |
| `prevent_default()` | cancel the browser's default action |
