# Bundled examples

The compiler repository includes four small packages. Install `pud` first, then clone the [compiler repository](https://github.com/puddi-lang/puddi). The commands below run from the repository root.

| Package | What it demonstrates | Command |
|---|---|---|
| [todo](https://github.com/puddi-lang/puddi/tree/v0.1.1/examples/todo) | Read data from JSON and handle errors | `cd examples/todo` then `pud run` |
| [wordfreq](https://github.com/puddi-lang/puddi/tree/v0.1.1/examples/wordfreq) | Read standard input and count tokens with a map | `printf 'a b a\n' \| pud run examples/wordfreq` |
| [plugin](https://github.com/puddi-lang/puddi/tree/v0.1.1/examples/plugin) | Implement exports for a custom WIT world | `pud build examples/plugin --target plugin` |
| [plugin-host](https://github.com/puddi-lang/puddi/tree/v0.1.1/examples/plugin-host) | Use several host capabilities in one component | `pud build examples/plugin-host --target plugin` |

`todo` reads `todos.json` from the current working directory and reports `2 of 4 left`. `wordfreq` prints two lines, with count 2 for `a` and count 1 for `b`. The plugin builds produce `target/plugin/plug.wasm` and `target/plugin/plugin-host.wasm` under their respective package directories.

For a plugin invocation you can reproduce end to end, follow [Plugins](../interop/plugins.md). The `greet` export in the `plugin` example calls the custom `demo:host/log` interface, which the embedded runner cannot provide. The `classify` export does not call that interface.
