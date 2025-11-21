import React, { useEffect, useRef } from 'react'
import { createRoot } from 'react-dom/client'
import { createParticleWaveSphere } from 'particle-wave-sphere'
function App(){
  const ref = useRef(null)
  useEffect(()=>{
    const api = createParticleWaveSphere(ref.current, { width: 320, height: 320, waveCount: 6 })
    return ()=> api.destroy()
  },[])
  return <div style={{padding:20}}><canvas ref={ref} style={{width:320, height:320}}/></div>
}
createRoot(document.getElementById('root')).render(<App/>)