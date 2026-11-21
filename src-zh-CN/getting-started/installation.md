# 安装

`pud` 是一个独立的可执行文件，包含编译器、格式化器、包管理器和 `wasi` 目标的 WebAssembly 运行时。

## 安装脚本

macOS 和 Linux 支持 x86_64 和 arm64：

```sh
curl -fsSL https://raw.githubusercontent.com/puddi-lang/puddi/main/install.sh | sh
```

Windows 请在 PowerShell 中运行：

```powershell
irm https://raw.githubusercontent.com/puddi-lang/puddi/main/install.ps1 | iex
```

脚本下载最新[发行版](https://github.com/puddi-lang/puddi/releases)，校验 SHA-256 后将 `pud` 安装到 `~/.pud/bin`，并把目录加入 `PATH`。Unix 上会更新存在的 shell 配置，Windows 上会更新用户级 `PATH`。安装后打开新终端，或按脚本输出刷新环境。

| 环境变量 | 用途 |
|---|---|
| `PUD_VERSION` | 安装指定版本，例如 `v0.1.2`；默认取最新发行版 |
| `PUD_INSTALL` | 指定安装目录，默认 `~/.pud` |
| `PUD_NO_MODIFY_PATH` | 设为 `1` 时保留 shell 配置与 `PATH` |

```sh
curl -fsSL https://raw.githubusercontent.com/puddi-lang/puddi/main/install.sh | PUD_VERSION=v0.1.2 sh
```

升级时重新运行安装脚本。卸载时移除已安装的可执行文件，以及脚本向 shell 配置或 Windows 用户 `PATH` 写入的路径。使用过 `PUD_INSTALL` 的话，请从对应目录移除。

## 发行版压缩包

每个[发行版](https://github.com/puddi-lang/puddi/releases)为以下平台提供压缩包、各自的 `.sha256` 文件以及汇总的 `SHA256SUMS`。

| 压缩包 | 平台 |
|---|---|
| `pud-x86_64-unknown-linux-gnu.tar.gz` | Linux x86_64，glibc 2.35 或更新版本 |
| `pud-aarch64-unknown-linux-gnu.tar.gz` | Linux arm64，glibc 2.35 或更新版本 |
| `pud-x86_64-apple-darwin.tar.gz` | Intel Mac |
| `pud-aarch64-apple-darwin.tar.gz` | Apple 芯片的 Mac |
| `pud-x86_64-pc-windows-msvc.zip` | Windows x64，也可在 Windows arm64 上运行 |

解压后将 `pud` 或 `pud.exe` 放入 `PATH` 中的任一目录。

## 从源码安装

使用当前稳定版 Rust：

```sh
cargo install --locked --git https://github.com/puddi-lang/puddi --tag v0.1.2
```

加上 `--no-default-features` 可省去内嵌运行时，缩短编译时间。此时用 `pud build` 构建组件，再交给兼容的外部 WASI 0.3 宿主运行。详见[构建目标](../toolchain/targets.md)。

## Node.js

`pud test` 和 `browser` 目标的工具链路径需要 Node.js 22 或更新版本。异步代码需要 JSPI，Node.js 24 默认启用它。内嵌的 WASI 和插件运行时无需 Node.js。遇到宿主功能缺失时可查阅[故障排查](../toolchain/troubleshooting.md)。

## 确认安装

```sh
pud --version
```
