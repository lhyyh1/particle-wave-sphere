<template>
  <view :style="{ position: 'relative', width: width + 'px', height: height + 'px' }">
    <canvas 
      type="webgl" 
      :id="canvasId" 
      :canvas-id="canvasId"
      :style="{ width: '100%', height: '100%', display: 'block', background: backgroundColor }"
    ></canvas>
  </view>
</template>

<script>
import { createParticleWaveSphere } from 'particle-wave-sphere'

export default {
  name: 'ParticleWaveSphere',
  props: {
    width: { type: Number, default: 300 },
    height: { type: Number, default: 300 },
    backgroundColor: { type: String, default: 'transparent' },
    rotationSpeed: { type: Number, default: 0.4 },
    pointSize: { type: Number, default: 1.6 },
    sticky: { type: Number, default: 0.75 },
    colorA: { type: String, default: '#ffffff' },
    colorB: { type: String, default: '#ffffff' },
    waveAmp: { type: Number, default: 0.14 },
    waveFreq: { type: Number, default: 6.2 },
    waveSpeed: { type: Number, default: 0.8 },
    waveSharpness: { type: Number, default: 1.6 },
    waveClamp: { type: Number, default: 0.20 },
    waveCount: { type: Number, default: 5 },
    waveLobeSharpness: { type: Number, default: 14 },
    pixelRatio: { type: Number, default: null }
  },
  data() {
    return {
      api: null,
      canvasId: 'pws_canvas_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
    }
  },
  mounted() {
    this.initCanvas()
  },
  beforeDestroy() {
    this.destroy()
  },
  watch: {
    width() {
      if (this.api && this.width > 0 && this.height > 0) {
        try {
          this.api.resize(this.width, this.height)
        } catch (error) {
          console.error('Failed to resize ParticleWaveSphere:', error)
        }
      }
    },
    height() {
      if (this.api && this.width > 0 && this.height > 0) {
        try {
          this.api.resize(this.width, this.height)
        } catch (error) {
          console.error('Failed to resize ParticleWaveSphere:', error)
        }
      }
    },
    // 监听所有属性变化
    backgroundColor() { this.updateIfReady() },
    rotationSpeed() { this.updateIfReady() },
    pointSize() { this.updateIfReady() },
    sticky() { this.updateIfReady() },
    colorA() { this.updateIfReady() },
    colorB() { this.updateIfReady() },
    waveAmp() { this.updateIfReady() },
    waveFreq() { this.updateIfReady() },
    waveSpeed() { this.updateIfReady() },
    waveSharpness() { this.updateIfReady() },
    waveClamp() { this.updateIfReady() },
    waveCount() { this.updateIfReady() },
    waveLobeSharpness() { this.updateIfReady() }
  },
  methods: {
    initCanvas() {
      // #ifdef H5
      this.initH5()
      // #endif
      
      // #ifdef MP-WEIXIN || MP-ALIPAY || MP-BAIDU || MP-TOUTIAO || MP-QQ
      this.initMiniProgram()
      // #endif
      
      // #ifdef APP-PLUS
      this.initApp()
      // #endif
    },
    
    // H5 平台初始化
    initH5() {
      this.$nextTick(() => {
        try {
          const canvas = document.getElementById(this.canvasId)
          if (!canvas) {
            console.error('Canvas element not found')
            return
          }
          const pixelRatio = this.pixelRatio || (typeof devicePixelRatio !== 'undefined' ? Math.min(devicePixelRatio, 2) : 1)
          this.initWithCanvas(canvas, pixelRatio)
        } catch (error) {
          console.error('Failed to create ParticleWaveSphere (H5):', error)
        }
      })
    },
    
    // 小程序平台初始化
    initMiniProgram() {
      // 小程序需要延迟获取，确保 DOM 已渲染
      setTimeout(() => {
        this.$nextTick(() => {
          try {
            // 获取系统信息
            const systemInfo = uni.getSystemInfoSync()
            const pixelRatio = this.pixelRatio || (systemInfo.pixelRatio || 1)
            
            // 创建选择器查询
            const query = uni.createSelectorQuery().in(this)
            query.select(`#${this.canvasId}`).node((res) => {
              if (!res || !res.node) {
                console.error('Canvas node not found, retrying...')
                // 重试一次
                setTimeout(() => {
                  const retryQuery = uni.createSelectorQuery().in(this)
                  retryQuery.select(`#${this.canvasId}`).node((retryRes) => {
                    if (retryRes && retryRes.node) {
                      this.initWithCanvas(retryRes.node, pixelRatio)
                    } else {
                      console.error('Canvas node not found after retry')
                    }
                  }).exec()
                }, 100)
                return
              }
              this.initWithCanvas(res.node, pixelRatio)
            }).exec()
          } catch (error) {
            console.error('Failed to create ParticleWaveSphere (MiniProgram):', error)
          }
        })
      }, 100)
    },
    
    // App 平台初始化
    initApp() {
      this.$nextTick(() => {
        try {
          // App 平台也使用类似小程序的方式
          const query = uni.createSelectorQuery().in(this)
          query.select(`#${this.canvasId}`).node((res) => {
            if (!res || !res.node) {
              console.error('Canvas node not found')
              return
            }
            const systemInfo = uni.getSystemInfoSync()
            const pixelRatio = this.pixelRatio || (systemInfo.pixelRatio || 1)
            this.initWithCanvas(res.node, pixelRatio)
          }).exec()
        } catch (error) {
          console.error('Failed to create ParticleWaveSphere (App):', error)
        }
      })
    },
    
    // 统一的初始化方法
    initWithCanvas(canvas, pixelRatio) {
      try {
        this.api = createParticleWaveSphere(canvas, {
          width: this.width,
          height: this.height,
          backgroundColor: this.backgroundColor,
          rotationSpeed: this.rotationSpeed,
          pointSize: this.pointSize,
          sticky: this.sticky,
          colorA: this.colorA,
          colorB: this.colorB,
          waveAmp: this.waveAmp,
          waveFreq: this.waveFreq,
          waveSpeed: this.waveSpeed,
          waveSharpness: this.waveSharpness,
          waveClamp: this.waveClamp,
          waveCount: this.waveCount,
          waveLobeSharpness: this.waveLobeSharpness,
          pixelRatio: pixelRatio
        })
      } catch (error) {
        console.error('Failed to initialize ParticleWaveSphere with canvas:', error)
      }
    },
    
    updateIfReady() {
      if (this.api) {
        try {
          this.api.update({
            backgroundColor: this.backgroundColor,
            rotationSpeed: this.rotationSpeed,
            pointSize: this.pointSize,
            sticky: this.sticky,
            colorA: this.colorA,
            colorB: this.colorB,
            waveAmp: this.waveAmp,
            waveFreq: this.waveFreq,
            waveSpeed: this.waveSpeed,
            waveSharpness: this.waveSharpness,
            waveClamp: this.waveClamp,
            waveCount: this.waveCount,
            waveLobeSharpness: this.waveLobeSharpness
          })
        } catch (error) {
          console.error('Failed to update ParticleWaveSphere:', error)
        }
      }
    },
    
    update(patch) {
      if (this.api) {
        try {
          this.api.update(patch)
        } catch (error) {
          console.error('Failed to update ParticleWaveSphere:', error)
        }
      }
    },
    
    resize(w, h) {
      if (this.api && w > 0 && h > 0) {
        try {
          this.api.resize(w, h)
        } catch (error) {
          console.error('Failed to resize ParticleWaveSphere:', error)
        }
      }
    },
    
    destroy() {
      if (this.api) {
        try {
          this.api.destroy()
        } catch (error) {
          console.error('Failed to destroy ParticleWaveSphere:', error)
        }
        this.api = null
      }
    }
  }
}
</script>

<style scoped>
</style>

