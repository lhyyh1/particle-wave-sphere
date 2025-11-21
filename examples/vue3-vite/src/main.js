import { createApp, onMounted, ref } from 'vue'
import { createParticleWaveSphere } from 'particle-wave-sphere'
const App = {
  setup(){
    const cv = ref(null)
    onMounted(()=>{
      const api = createParticleWaveSphere(cv.value, { width: 320, height: 320, waveCount: 5 })
      window.__pws = api
    })
    return { cv }
  },
  template: `<div style="padding:20px"><canvas ref="cv" style="width:320px;height:320px"></canvas></div>`
}
createApp(App).mount('#app')