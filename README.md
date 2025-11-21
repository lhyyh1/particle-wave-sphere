# Particle Wave Sphere

一个美丽的 WebGL 粒子波浪球体动画库，支持 React、Vue 2/3 和 UniApp。

![License](https://img.shields.io/npm/l/particle-wave-sphere)
![Version](https://img.shields.io/npm/v/particle-wave-sphere)
![GitHub stars](https://img.shields.io/github/stars/lhyyh1/particle-wave-sphere)
![npm downloads](https://img.shields.io/npm/dm/particle-wave-sphere)

## 特性

- ✨ 美丽的 3D 粒子波浪球体动画
- 🚀 高性能 WebGL 渲染
- 📦 支持多种框架：React、Vue 2、Vue 3、UniApp
- 🎨 丰富的自定义选项
- 📱 支持 H5、小程序、App 多平台
- 💪 TypeScript 类型支持
- 🎯 零依赖

## 安装

```bash
npm install particle-wave-sphere
# 或
yarn add particle-wave-sphere
# 或
pnpm add particle-wave-sphere
```

## 快速开始

### React

```jsx
import { ParticleWaveSphere } from 'particle-wave-sphere/react'

function App() {
  return (
    <ParticleWaveSphere 
      width={300} 
      height={300}
      colorA="#00ff88"
      colorB="#0088ff"
      waveCount={6}
    />
  )
}
```

### Vue 3

```vue
<template>
  <ParticleWaveSphere 
    :width="300" 
    :height="300"
    color-a="#00ff88"
    color-b="#0088ff"
    :wave-count="6"
  />
</template>

<script setup>
import { ParticleWaveSphere } from 'particle-wave-sphere/vue3'
</script>
```

### Vue 2

```vue
<template>
  <ParticleWaveSphere 
    :width="300" 
    :height="300"
    color-a="#00ff88"
    color-b="#0088ff"
    :wave-count="6"
  />
</template>

<script>
import { ParticleWaveSphere } from 'particle-wave-sphere/vue2'

export default {
  components: {
    ParticleWaveSphere
  }
}
</script>
```

### UniApp

```vue
<template>
  <view>
    <ParticleWaveSphere 
      :width="300" 
      :height="300"
      color-a="#00ff88"
      color-b="#0088ff"
      :wave-count="6"
    />
  </view>
</template>

<script>
import ParticleWaveSphere from 'particle-wave-sphere/uni-app'

export default {
  components: {
    ParticleWaveSphere
  }
}
</script>
```

### 原生 JavaScript

```javascript
import { createParticleWaveSphere } from 'particle-wave-sphere'

const canvas = document.getElementById('canvas')
const api = createParticleWaveSphere(canvas, {
  width: 300,
  height: 300,
  colorA: '#00ff88',
  colorB: '#0088ff',
  waveCount: 6
})

// 更新属性
api.update({ waveCount: 8 })

// 调整尺寸
api.resize(400, 400)

// 销毁
api.destroy()
```

## API

### Props / Options

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| width | Number | 300 | 画布宽度（px） |
| height | Number | 300 | 画布高度（px） |
| backgroundColor | String | 'transparent' | 背景颜色 |
| rotationSpeed | Number | 0.4 | 旋转速度 |
| pointSize | Number | 1.6 | 粒子大小 |
| sticky | Number | 0.75 | 粘性系数 |
| colorA | String | '#ffffff' | 颜色A（渐变起始） |
| colorB | String | '#ffffff' | 颜色B（渐变结束） |
| waveAmp | Number | 0.14 | 波浪振幅 |
| waveFreq | Number | 6.2 | 波浪频率 |
| waveSpeed | Number | 0.8 | 波浪速度 |
| waveSharpness | Number | 1.6 | 波浪锐度 |
| waveClamp | Number | 0.20 | 波浪限制 |
| waveCount | Number | 5 | 波浪数量（1-8） |
| waveLobeSharpness | Number | 14 | 波浪瓣锐度 |
| pixelRatio | Number | null | 像素比（自动检测） |

### 方法

#### update(patch)
更新属性

```javascript
api.update({
  waveCount: 6,
  rotationSpeed: 0.8,
  colorA: '#ff00ff'
})
```

#### resize(w, h)
调整尺寸

```javascript
api.resize(400, 400)
```

#### destroy()
销毁实例，释放资源

```javascript
api.destroy()
```

## 示例

查看 `examples` 目录获取更多示例：

- [React 示例](./examples/react-vite)
- [Vue 3 示例](./examples/vue3-vite)
- [Vue 2 示例](./examples/vue2)
- [UniApp 示例](./examples/uni-app)

## 平台支持

### Web
- ✅ Chrome/Edge
- ✅ Firefox
- ✅ Safari
- ✅ 移动浏览器

### 小程序
- ✅ 微信小程序
- ✅ 支付宝小程序
- ✅ 百度小程序
- ✅ 抖音小程序
- ✅ QQ小程序

### App
- ✅ iOS
- ✅ Android

## 浏览器要求

需要支持 WebGL 的浏览器。大多数现代浏览器都支持。

## 开发

```bash
# 安装依赖
npm install

# 构建
npm run build

# 类型检查
npm run check:types
```

## 许可证

MIT License - 查看 [LICENSE](LICENSE) 文件了解详情

## 链接

- [GitHub 仓库](https://github.com/lhyyh1/particle-wave-sphere)
- [npm 包](https://www.npmjs.com/package/particle-wave-sphere)
- [问题反馈](https://github.com/lhyyh1/particle-wave-sphere/issues)

## 贡献

欢迎提交 Issue 和 Pull Request！

### 开发流程

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request

### 本地开发

```bash
# 克隆仓库
git clone https://github.com/lhyyh1/particle-wave-sphere.git
cd particle-wave-sphere

# 安装依赖
npm install

# 构建项目
npm run build

# 运行示例（如果可用）
cd examples/react-vite
npm install
npm run dev
```

## 发布

### 发布到 GitHub

1. 确保已初始化 Git 仓库：
   ```bash
   git init
   ```

2. 在 GitHub 上创建一个新仓库（如果还没有）

3. 添加远程仓库并推送：
   ```bash
   git remote add origin https://github.com/lhyyh1/particle-wave-sphere.git
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git push -u origin main
   ```

4. 更新 `package.json` 中的仓库 URL（将 `lhyyh1` 替换为你的 GitHub 用户名）

5. 创建标签（可选但推荐）：
   ```bash
   git tag -a v0.2.1 -m "Release version 0.2.1"
   git push origin v0.2.1
   ```

### 发布到 npm

#### 准备工作

1. 确保已登录 npm：
   ```bash
   npm login
   ```

2. 检查包名是否可用：
   ```bash
   npm view particle-wave-sphere
   ```
   如果包已存在，你需要修改 `package.json` 中的 `name` 字段

3. 验证包内容：
   ```bash
   npm pack --dry-run
   ```

#### 发布步骤

1. 更新版本号（如果需要）：
   ```bash
   # 补丁版本 (0.2.1 -> 0.2.2)
   npm version patch
   
   # 次要版本 (0.2.1 -> 0.3.0)
   npm version minor
   
   # 主要版本 (0.2.1 -> 1.0.0)
   npm version major
   ```

2. 构建项目（prepublishOnly 会自动运行）：
   ```bash
   npm run build
   ```

3. 发布到 npm：
   ```bash
   # 测试发布（推荐首次发布）
   npm publish --dry-run
   
   # 正式发布
   npm publish
   ```

4. 如果是公共包，使用：
   ```bash
   npm publish --access public
   ```

5. 验证发布：
   ```bash
   npm view particle-wave-sphere
   ```

#### 更新版本并同步到 GitHub

```bash
# 1. 更新版本号
npm version patch

# 2. 构建并发布到 npm
npm publish

# 3. 推送到 GitHub（包括标签）
git push origin main --tags
```

### 发布检查清单

- [ ] 代码已通过测试
- [ ] README.md 已更新
- [ ] 版本号已更新
- [ ] CHANGELOG 已更新（如果有）
- [ ] package.json 中的信息完整（author, repository, etc.）
- [ ] 已构建最新代码
- [ ] 已登录 npm
- [ ] Git 状态干净

## 更新日志

### 0.2.1
- ✨ 新增 UniApp 支持
- 🐛 修复 React 包装器依赖项问题
- 🐛 修复代码重复问题
- ✨ 添加错误处理和参数验证
- 📝 完善文档

### 0.2.0
- 初始版本
