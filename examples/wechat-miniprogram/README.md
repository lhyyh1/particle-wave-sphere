# WeChat Mini Program
In a custom component:
```js
const q = wx.createSelectorQuery().in(this)
q.select('#cv').node(res => {
  const canvas = res.node
  const { createParticleWaveSphere } = require('particle-wave-sphere')
  this.api = createParticleWaveSphere(canvas, { width: 300, height: 300 })
}).exec()
```