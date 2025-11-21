const core = require('../../dist/index.cjs')
Component({
  properties: {
    width: { type: Number, value: 300 },
    height:{ type: Number, value: 300 },
    backgroundColor: { type: String, value: 'transparent' },
    rotationSpeed: { type: Number, value: 0.4 },
    pointSize: { type: Number, value: 1.6 },
    sticky: { type: Number, value: 0.75 },
    colorA: { type: String, value: '#ffffff' },
    colorB: { type: String, value: '#ffffff' },
    waveAmp: { type: Number, value: 0.14 },
    waveFreq:{ type: Number, value: 6.2 },
    waveSpeed:{ type: Number, value: 0.8 },
    waveSharpness:{ type: Number, value: 1.6 },
    waveClamp: { type: Number, value: 0.20 },
    waveCount: { type: Number, value: 5 },
    waveLobeSharpness: { type: Number, value: 14 }
  },
  lifetimes: {
    ready() {
      const q = wx.createSelectorQuery().in(this)
      q.select('#cv').node(res => {
        const canvas = res.node
        this.api = core.createParticleWaveSphere(canvas, { ...this.properties, pixelRatio: wx.getSystemInfoSync().pixelRatio })
      }).exec()
    },
    detached(){ this.api && this.api.destroy() }
  },
  observers: {
    'width,height'(w,h){ this.api && this.api.resize(this.data.width, this.data.height) },
    '**'(nv){ this.api && this.api.update(this.properties) }
  },
  methods: {
    update(p){ this.api && this.api.update(p) },
    resize(w,h){ this.api && this.api.resize(w,h) },
    destroy(){ this.api && this.api.destroy() }
  }
})