/**
 * Vue 2 wrapper for particle-wave-sphere
 */
import { createParticleWaveSphere } from 'particle-wave-sphere'
export default {
  name: 'ParticleWaveSphere',
  props: {
    width: { type: Number, default: 300 },
    height:{ type: Number, default: 300 },
    backgroundColor: { type: String, default: 'transparent' },
    rotationSpeed: { type: Number, default: 0.4 },
    pointSize: { type: Number, default: 1.6 },
    sticky: { type: Number, default: 0.75 },
    colorA: { type: String, default: '#ffffff' },
    colorB: { type: String, default: '#ffffff' },
    waveAmp: { type: Number, default: 0.14 },
    waveFreq:{ type: Number, default: 6.2 },
    waveSpeed:{ type: Number, default: 0.8 },
    waveSharpness:{ type: Number, default: 1.6 },
    waveClamp: { type: Number, default: 0.20 },
    waveCount: { type: Number, default: 5 },
    waveLobeSharpness: { type: Number, default: 14 }
  },
  data() { return { api: null } },
  mounted() {
    if (!this.$refs.cv) return
    try {
      this.api = createParticleWaveSphere(this.$refs.cv, { ...this.$props })
    } catch (error) {
      console.error('Failed to create ParticleWaveSphere:', error)
    }
  },
  beforeDestroy() {
    if (this.api) {
      try {
        this.api.destroy()
      } catch (error) {
        console.error('Error destroying ParticleWaveSphere:', error)
      }
      this.api = null
    }
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
    $props: {
      handler(nv) {
        if (this.api) {
          try {
            this.api.update(nv)
          } catch (error) {
            console.error('Failed to update ParticleWaveSphere:', error)
          }
        }
      },
      deep: true
    }
  },
  methods: {
    update(p) {
      if (this.api) {
        try {
          this.api.update(p)
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
  },
  render(h){
    return h('div', { style: { width: this.width+'px', height: this.height+'px', position: 'relative' } }, [
      h('canvas', { ref: 'cv', style: { width: '100%', height: '100%', display: 'block' } })
    ])
  }
}