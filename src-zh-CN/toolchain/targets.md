# 构建目标

各目标使用同一套语言。`@target(...)` 可把声明限定到特定目标。导入目标不支持的模块会导致编译错误，见[各目标可用的模块](../stdlib/modules.md)。

| 目标 | 产物 | 入口 |
|---|---|---|
| `wasi`，默认 | 对应 `[target.wasi]` world 的 WASI 0.3 组件，默认 `wasi:cli/command` | 命令使用 `fn main()` 或 `async fn main()`，其他 world 使用 `export fn` |
| `browser` | 组件与 JavaScript 加载器 `puddi.mjs` | `fn main()`、`async fn main()`、`export fn` |
| `plugin` | 对应 `[target.plugin]` world 的组件 | world 所要求的导出 |

## wasi

缺省目标 world 是 `wasi:cli/command@0.3.2`，也可通过 `[target.wasi]` 选择其他 world。运行时使用 WASI 流读写标准输入和输出，通过文件系统预打开目录访问文件，通过 `wasi:clocks`、`wasi:random` 获取时间与随机数，`std.http` 走 `wasi:http/client`。`run` 使用异步 ABI，阻塞 WASI 调用只挂起发出调用的任务。

WASI 产物要求 WASI 0.3。`pud run` 使用内嵌 Wasmtime。外部宿主还须支持组件模型的异步和线程、WasmGC 和异常处理。使用工作线程时，还须提供 `puddi:runtime` 接口。

使用 `--no-default-features` 构建的 `pud` 省去了内嵌运行时。可以执行 `pud build` 后将组件交给兼容宿主。如果程序可以使用 JavaScript 宿主函数，也可用 `PUD_HOST=node pud run`。

## browser

`pud build --target browser` 生成组件和 `puddi.mjs`。`pud run --target browser` 启动本地开发服务器。加载器从组件中取出核心模块，再以 JavaScript 宿主函数实例化。浏览器需要 WasmGC，异步代码还需要 JSPI。见[浏览器](../interop/browser.md)。

## plugin

插件根据编辑器、游戏或服务等宿主定义的 WIT world 构建。清单指定 world：

```toml
[target.plugin]
world = "wit/host.wit#plugin"
```

`export fn` 实现 world 的导出。编译器会检查必需导出及其签名。见[插件](../interop/plugins.md)。

## 输出格式

各目标都使用 WasmGC。结构体和枚举会映射到 GC 结构体，泛型会单态化，闭包和特征对象在 GC 结构体中保存函数引用。组件由 `wit-component` 编码。
