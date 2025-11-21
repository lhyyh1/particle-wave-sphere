# 发布指南

本文档说明如何将 `particle-wave-sphere` 发布到 GitHub 和 npm。

## 发布前准备

### 1. 更新 package.json

在发布前，请确保更新以下信息：

- **author**: 添加作者信息（例如：`"Your Name <your.email@example.com>"`）
- **repository.url**: 将 `lhyyh1` 替换为你的 GitHub 用户名
- **bugs.url**: 更新为实际的 GitHub Issues 地址
- **homepage**: 更新为实际的 GitHub 仓库地址

### 2. 更新 README.md

- 将所有 `lhyyh1` 替换为你的实际 GitHub 用户名
- 检查所有链接是否正确

## 发布到 GitHub

### 首次发布

1. **初始化 Git 仓库**（如果还没有）：
   ```bash
   git init
   ```

2. **添加文件并提交**：
   ```bash
   git add .
   git commit -m "Initial commit"
   ```

3. **在 GitHub 上创建新仓库**：
   - 访问 https://github.com/new
   - 创建名为 `particle-wave-sphere` 的仓库
   - **不要**初始化 README、.gitignore 或 LICENSE（我们已经有了）

4. **添加远程仓库并推送**：
   ```bash
   git remote add origin https://github.com/lhyyh1/particle-wave-sphere.git
   git branch -M main
   git push -u origin main
   ```

### 后续更新

1. **添加更改**：
   ```bash
   git add .
   git commit -m "描述你的更改"
   ```

2. **推送到 GitHub**：
   ```bash
   git push origin main
   ```

3. **创建标签**（发布新版本时）：
   ```bash
   git tag -a v0.2.1 -m "Release version 0.2.1"
   git push origin v0.2.1
   ```

## 发布到 npm

### 首次发布

1. **创建 npm 账号**（如果还没有）：
   - 访问 https://www.npmjs.com/signup
   - 创建账号

2. **登录 npm**：
   ```bash
   npm login
   ```
   输入你的用户名、密码和邮箱

3. **检查包名是否可用**：
   ```bash
   npm view particle-wave-sphere
   ```
   如果返回 404，说明包名可用；如果返回包信息，说明已被占用，需要修改 `package.json` 中的 `name` 字段

4. **验证包内容**：
   ```bash
   npm pack --dry-run
   ```
   这会显示哪些文件会被包含在包中

5. **构建项目**：
   ```bash
   npm run build
   ```

6. **发布包**：
   ```bash
   # 如果是公共包（推荐）
   npm publish --access public
   
   # 或者直接发布
   npm publish
   ```

### 更新版本并发布

1. **更新版本号**：
   ```bash
   # 补丁版本 (0.2.1 -> 0.2.2) - 修复 bug
   npm run version:patch
   
   # 次要版本 (0.2.1 -> 0.3.0) - 新功能
   npm run version:minor
   
   # 主要版本 (0.2.1 -> 1.0.0) - 重大变更
   npm run version:major
   ```
   
   这会：
   - 自动更新 `package.json` 中的版本号
   - 创建 Git 提交和标签

2. **构建并发布**：
   ```bash
   npm publish
   ```
   `prepublishOnly` 脚本会自动运行构建

3. **推送到 GitHub（包括标签）**：
   ```bash
   git push origin main --tags
   ```

### 测试发布

如果你想在发布前测试，可以使用：

```bash
# 测试构建
npm run build

# 测试打包
npm pack

# 测试发布（不会真正发布）
npm publish --dry-run
```

## 完整发布流程示例

```bash
# 1. 确保所有更改已提交
git add .
git commit -m "Your changes"

# 2. 更新版本号（例如：补丁版本）
npm run version:patch

# 3. 构建并发布到 npm
npm publish

# 4. 推送代码和标签到 GitHub
git push origin main --tags
```

## 常见问题

### 如何撤销已发布的版本？

npm 不允许直接删除已发布的版本，但可以：

1. **发布一个修复版本**（推荐）
2. **废弃某个版本**：
   ```bash
   npm deprecate particle-wave-sphere@0.2.1 "This version has a bug, please use 0.2.2"
   ```

### 忘记更新版本号就发布了怎么办？

可以发布一个补丁版本来修复：
```bash
npm run version:patch
npm publish
```

### 如何发布测试版本？

可以使用预发布版本：
```bash
npm version 0.2.2-beta.1
npm publish --tag beta
```

用户可以通过以下方式安装测试版本：
```bash
npm install particle-wave-sphere@beta
```

## 验证发布

发布后，验证包是否成功发布：

```bash
# 查看包信息
npm view particle-wave-sphere

# 查看特定版本
npm view particle-wave-sphere@0.2.1

# 测试安装
npm install particle-wave-sphere
```

## 参考链接

- [npm 发布文档](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)
- [语义化版本](https://semver.org/lang/zh-CN/)
- [GitHub 标签](https://docs.github.com/en/authentication/managing-commit-signature-verification/about-commit-signature-verification)

