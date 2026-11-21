# 浏览器

`browser` 目标生成组件和加载器 `puddi.mjs`。`std.dom` 用于操作文档，`std.http` 由 `fetch` 实现，`std.worker` 使用 Web Workers。

```puddi,browser
import std.dom

fn main() {
    dom.set_title("Counter")
    let label = dom.create("p")
    label.set_text("clicked 0 times")
    let button = dom.create("button")
    button.set_text("click me")
    var clicks = 0
    button.on("click", |e| {
        clicks += 1
        label.set_text("clicked {clicks} times")
    })
    dom.body().append(label)
    dom.body().append(button)
}
```

```sh
pud run --target browser    # serves the page on http://127.0.0.1:8000
pud build --target browser  # writes target/browser/<name>.wasm and puddi.mjs
```

## 部署

`pud build --target browser` 将 `<name>.wasm`、`puddi.mjs` 和 `index.html` 写入 `target/browser/`。把它们放到同一个静态站点目录，`.wasm` 文件用 `application/wasm` 类型提供。

也可以在自定义网页里以模块形式加载 Puddi 程序。

```html
<script type="module">
  import { load } from "./puddi.mjs";
  const app = await load("./counter.wasm", {
    output(fd, line) { (fd === 2 ? console.error : console.log)(line) }
  });
  await app.run();      // runs main and resolves to the exit code
</script>
```

`load` 返回 `{ instance, exports, run }`。回调 `output` 接收输出的每一行，`fd` 为 1 表示标准输出，为 2 表示错误或 panic。省略回调时，输出发往控制台。

## 浏览器要求

浏览器需要支持 WebAssembly GC。异步代码还要求 JSPI。可以用近期的 Chromium 浏览器运行异步示例，或检查环境中是否存在 `WebAssembly.Suspending` 与 `WebAssembly.promising`。

## 加载器原理

加载器的作用类似 `jco transpile`，它从组件中取出核心模块，提供该组件所需的 JavaScript 宿主函数，然后实例化核心模块。

DOM API 见 [std.dom](../stdlib/dom.md)。
