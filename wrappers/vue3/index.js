/**
 * Vue 3 wrapper (no SFC) for particle-wave-sphere
 */
import { onMounted, onBeforeUnmount, ref, watch, defineComponent, h } from 'vue'
import { createParticleWaveSphere } from '../src/index.js'

export default defineComponent({
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
  setup(props, { expose }) {
    const cv = ref(null)
    let api = null
    onMounted(() => {
      if (!cv.value) return
      try {
        api = createParticleWaveSphere(cv.value, { ...props })
      } catch (error) {
        console.error('Failed to create ParticleWaveSphere:', error)
      }
    })
    onBeforeUnmount(() => {
      if (api) {
        try {
          api.destroy()
        } catch (error) {
          console.error('Error destroying ParticleWaveSphere:', error)
        }
        api = null
      }
    })
    watch(() => [props.width, props.height], ([w, h]) => {
      if (api && w > 0 && h > 0) {
        try {
          api.resize(w, h)
        } catch (error) {
          console.error('Failed to resize ParticleWaveSphere:', error)
        }
      }
    })
    watch(props, (nv) => {
      if (api) {
        try {
          api.update(nv)
        } catch (error) {
          console.error('Failed to update ParticleWaveSphere:', error)
        }
      }
    }, { deep: true })
    expose({
      update: (p) => {
        if (api) {
          try {
            api.update(p)
          } catch (error) {
            console.error('Failed to update ParticleWaveSphere:', error)
          }
        }
      },
      resize: (w, h) => {
        if (api && w > 0 && h > 0) {
          try {
            api.resize(w, h)
          } catch (error) {
            console.error('Failed to resize ParticleWaveSphere:', error)
          }
        }
      },
      destroy: () => {
        if (api) {
          try {
            api.destroy()
          } catch (error) {
            console.error('Failed to destroy ParticleWaveSphere:', error)
          }
          api = null
        }
      }
    })
    return ()=> h('div', { style: { width: props.width+'px', height: props.height+'px', position:'relative' } }, [
      h('canvas', { ref: cv, style: 'width:100%;height:100%;display:block' })
    ])
  }
})