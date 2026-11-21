# 依赖

包依赖可以是发布语义化版本标签的 Git 仓库，也可以是本地目录。

```toml
[deps]
json = "github.com/someone/puddi-json@1.2"
util = { path = "../util" }
```

依赖键名（如 `json`、`util`）用于导入。`import json` 导入其根模块，`import json.parser` 导入子模块。仅 `pub` 声明对其他包可见。

## Git 依赖

`@` 后是最低版本，仓库用 `v1.2.0` 等 Git 标签发布。`pud add` 写入清单并解析依赖。

```sh
pud add github.com/someone/puddi-json@1.2
```

### 最小版本选择

每个依赖选择满足整张依赖图所有要求的最低版本。因此构建不会自动使用高于要求的发行版。一个包的不同主版本是不同的依赖，可同时使用。

### 锁文件

`pud.lock` 记录解析出的标签对应的确切提交，避免标签被移动后悄悄改变构建结果。将它与 `pud.toml` 一起提交。

## 路径依赖

```toml
[deps]
util = { path = "../util" }
```

路径相对于清单所在目录。单仓库管理多个包，或同时开发库和应用时，可用路径依赖。

## 规则

- 包之间的依赖必须无环，同一包内的模块可以循环导入
- 单文件模式如 `pud run file.pud` 无法使用包依赖
- `impl Trait for Type` 须放在定义该特征或类型的包中
