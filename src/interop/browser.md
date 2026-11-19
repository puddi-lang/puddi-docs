# The browser

The `browser` target builds a component plus `puddi.mjs`, a loader that instantiates it in the page. Programs get `std.dom` for the document, `std.http` backed by `fetch`, and `std.worker` backed by Web Workers.

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

## Deploying

`pud build --target browser` writes everything a page needs to `target/browser/`: the component `<name>.wasm`, the loader `puddi.mjs` and an `index.html` that runs the program. The files are static and can be served by any web server; serve `.wasm` files with the `application/wasm` content type.

To embed the program in a page of your own, import the loader as a module:

```html
<script type="module">
  import { load } from "./puddi.mjs";
  const app = await load("./counter.wasm", {
    output(fd, line) { (fd === 2 ? console.error : console.log)(line) }
  });
  await app.run();      // runs main and resolves to the exit code
</script>
```

`load` returns `{ instance, exports, run }`. `output` receives each line the program prints, with `fd` 1 for standard output and 2 for errors and panics; without it, lines go to the console.

## Requirements

The page needs WebAssembly GC, available in current Chrome, Edge, Firefox and Safari. Async code uses JSPI (JavaScript Promise Integration), which current Chromium-based browsers enable by default.

## How the loader works

Browsers cannot instantiate components yet. The loader does what `jco transpile` does: it takes the core module out of the component and instantiates it with the host functions that the component's world imports.

See [std.dom](../stdlib/dom.md) for the DOM API.
