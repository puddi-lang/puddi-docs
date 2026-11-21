# 一致性测试套件

[语言规范](spec.md)定义 Puddi。[编译器仓库的测试套件](https://github.com/puddi-lang/puddi/tree/main/conformance)通过外部命令检查 `pud` 是否符合规范。

- 每个用例注明对应的规范小节
- 第 2 至 10 章的每个规范小节至少有一个通过的用例，否则严格覆盖率检查失败
- `xfail` 表示记录在案的实现差异。如果该用例开始通过，套件会报错，直到移除标记

v0.1.2 的每个规范性小节都有通过的用例。发行流程会对每个原生平台的二进制运行一致性测试。

## 运行

需要 Node.js 22 或更新版本。可以传入任意待检查的 `pud`，包括安装的发行版。

```sh
git clone https://github.com/puddi-lang/puddi
cd puddi
node conformance/run.mjs --pud ~/.pud/bin/pud --coverage
```

| 选项 | 含义 |
|---|---|
| `--pud <path>` | 待检查二进制，默认依次查找 `target/release/pud`、`target/debug/pud` 和 `PATH` |
| `--filter <text>` | 按小节号或用例路径筛选 |
| `--coverage` | 输出各小节覆盖情况 |
| `--strict-coverage` | 缺少通过用例的规范小节使检查失败 |
| `--json <file>` | 输出 JSON 报告 |
| `--list` | 只列出用例 |
| `--jobs <n>` | 限制同时运行的用例数 |
| `--timeout <seconds>` | 限制单个用例的时间 |

<a id="known-gaps-in-01"></a>

## 0.1 的已知差异

下表记录 v0.1.0 和 v0.1.1 的差异。相应用例已在 v0.1.2 中通过。

| 小节 | 差异 |
|---|---|
| 2.4 | 命名不合规时未发出警告 |
| 2.4 | 结构体字面量要求类型名以大写字母开头 |
| 3.7 | `U8 + 0.5` 不将右侧字面量默认推断为 `Float` |
| 3.12 | 在 `impl` 内不能解析 `Self.Item` |
| 3.12 | 重复的 `impl` 被接受 |
| 4.6 | `let inc = \|x\| x + 1` 需要参数标注 |
| 8.3 | 使用 WIT 记录、变体、枚举或标志位的导出无法编译 |

<a id="writing-cases"></a>

## 编写用例

用例可为单个 `.pud` 文件或一个小包。在源文件开头以 `//` 标注规范小节和执行模式，用 `//>` 声明预期输出。规范行为发生变化时应同时补充用例。详见[用例格式](https://github.com/puddi-lang/puddi/blob/main/conformance/README.md)与[参与贡献](../community/contributing.md)。
