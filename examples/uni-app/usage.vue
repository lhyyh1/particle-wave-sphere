<template>
  <view class="container">
    <view class="title">Particle Wave Sphere 示例</view>
    
    <!-- 基础用法 -->
    <view class="section">
      <view class="section-title">基础用法</view>
      <ParticleWaveSphere 
        :width="320" 
        :height="320"
        color-a="#00ff88"
        color-b="#0088ff"
        :wave-count="6"
      />
    </view>
    
    <!-- 自定义配置 -->
    <view class="section">
      <view class="section-title">自定义配置</view>
      <ParticleWaveSphere 
        :width="300" 
        :height="300"
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
    </view>
    
    <!-- 动态控制 -->
    <view class="section">
      <view class="section-title">动态控制</view>
      <ParticleWaveSphere 
        ref="pws"
        :width="width" 
        :height="height"
        :wave-count="waveCount"
        :rotation-speed="rotationSpeed"
      />
      <view class="controls">
        <button @click="changeWaveCount">改变波浪数量</button>
        <button @click="changeRotationSpeed">改变旋转速度</button>
        <button @click="resize">改变尺寸</button>
      </view>
    </view>
  </view>
</template>

<script>
import ParticleWaveSphere from '../../wrappers/uni-app/ParticleWaveSphere.vue'

export default {
  components: {
    ParticleWaveSphere
  },
  data() {
    return {
      width: 300,
      height: 300,
      waveCount: 5,
      rotationSpeed: 0.4
    }
  },
  methods: {
    changeWaveCount() {
      this.waveCount = Math.floor(Math.random() * 8) + 1
    },
    changeRotationSpeed() {
      this.rotationSpeed = Math.random() * 1.0 + 0.2
    },
    resize() {
      this.width = Math.floor(Math.random() * 200) + 200
      this.height = Math.floor(Math.random() * 200) + 200
    }
  }
}
</script>

<style scoped>
.container {
  padding: 20px;
  background-color: #f5f5f5;
}

.title {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}

.section {
  margin-bottom: 40px;
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 15px;
  color: #666;
}

.controls {
  margin-top: 15px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.controls button {
  padding: 10px 20px;
  background-color: #007aff;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 14px;
}
</style>

