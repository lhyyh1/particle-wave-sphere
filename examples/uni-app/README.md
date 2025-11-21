# UniApp 使用指南

## 安装

将 `wrappers/uni-app` 目录复制到你的 uni-app 项目中，或者通过 npm 安装（如果已发布到 npm）。

## 基础用法

### 1. 导入组件

```vue
<template>
  <view>
    <ParticleWaveSphere 
      :width="300" 
      :height="300"
    />
  </view>
</template>

<script>
import ParticleWaveSphere from '@/wrappers/uni-app/ParticleWaveSphere.vue'
// 或者
import ParticleWaveSphere from 'particle-wave-sphere/wrappers/uni-app'

export default {
  components: {
    ParticleWaveSphere
  }
}
</script>
```

### 2. 自定义配置

```vue
<template>
  <ParticleWaveSphere 
    :width="320" 
    :height="320"
    background-color="#000000"
    :rotation-speed="0.6"
    :point-size="2.0"
    color-a="#ff00ff"
    color-b="#ffff00"
    :wave-amp="0.2"
    :wave-freq="7.0"
    :wave-speed="1.0"
    :wave-count="8"
  />
</template>
```

### 3. 动态控制

```vue
<template>
  <view>
    <ParticleWaveSphere 
      ref="pws"
      :width="width" 
      :height="height"
      :wave-count="waveCount"
    />
    <button @click="updateProps">更新属性</button>
  </view>
</template>

<script>
import ParticleWaveSphere from '@/wrappers/uni-app/ParticleWaveSphere.vue'

export default {
  components: {
    ParticleWaveSphere
  },
  data() {
    return {
      width: 300,
      height: 300,
      waveCount: 5
    }
  },
  methods: {
    updateProps() {
      // 通过 ref 调用方法
      this.$refs.pws.update({
        waveCount: 6,
        rotationSpeed: 0.8
      })
      
      // 或者直接修改 props（会自动更新）
      this.waveCount = 7
      this.width = 400
    }
  }
}
</script>
```

## Props 参数

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

## 方法

通过 `ref` 可以调用以下方法：

### update(patch)
更新属性
```javascript
this.$refs.pws.update({
  waveCount: 6,
  rotationSpeed: 0.8
})
```

### resize(w, h)
调整尺寸
```javascript
this.$refs.pws.resize(400, 400)
```

### destroy()
销毁实例
```javascript
this.$refs.pws.destroy()
```

## 平台支持

- ✅ H5
- ✅ 微信小程序
- ✅ 支付宝小程序
- ✅ 百度小程序
- ✅ 抖音小程序
- ✅ QQ小程序
- ✅ App (iOS/Android)

## 注意事项

1. **Canvas 节点获取**：不同平台使用不同的方式获取 canvas 节点，组件已自动处理
2. **性能优化**：建议在不需要时调用 `destroy()` 方法释放资源
3. **像素比**：组件会自动检测设备像素比，也可以手动设置 `pixelRatio` 属性
4. **WebGL 支持**：需要设备支持 WebGL，不支持的环境会显示错误信息

## 完整示例

查看 `usage.vue` 文件获取完整的使用示例。
