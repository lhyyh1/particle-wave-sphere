/**
 * React wrapper for particle-wave-sphere
 */
import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react'
import { createParticleWaveSphere } from '../src/index.js'

export const ParticleWaveSphere = forwardRef((props, ref) => {
  const { width = 300, height = 300, ...rest } = props
  const canvasRef = useRef(null)
  const apiRef = useRef(null)
  const prevRestRef = useRef(null)

  // 初始化
  useEffect(() => {
    if (!canvasRef.current) return
    try {
      apiRef.current = createParticleWaveSphere(canvasRef.current, { width, height, ...rest })
      prevRestRef.current = rest
    } catch (error) {
      console.error('Failed to create ParticleWaveSphere:', error)
    }
    return () => {
      if (apiRef.current) {
        try {
          apiRef.current.destroy()
        } catch (e) {
          console.error('Error destroying ParticleWaveSphere:', e)
        }
        apiRef.current = null
      }
    }
  }, []) // 只在挂载时初始化一次

  // 处理尺寸变化
  useEffect(() => {
    if (apiRef.current && width > 0 && height > 0) {
      try {
        apiRef.current.resize(width, height)
      } catch (error) {
        console.error('Failed to resize ParticleWaveSphere:', error)
      }
    }
  }, [width, height])

  // 处理其他属性变化（避免使用 JSON.stringify）
  useEffect(() => {
    if (!apiRef.current || !prevRestRef.current) return
    
    const prev = prevRestRef.current
    // 检查是否有实际变化
    const changed = Object.keys(rest).some(key => rest[key] !== prev[key]) ||
                    Object.keys(prev).some(key => !(key in rest))
    
    if (changed) {
      try {
        apiRef.current.update(rest)
        prevRestRef.current = { ...rest }
      } catch (error) {
        console.error('Failed to update ParticleWaveSphere:', error)
      }
    }
  }, [
    rest.backgroundColor, rest.rotationSpeed, rest.pointSize, rest.sticky,
    rest.colorA, rest.colorB, rest.waveAmp, rest.waveFreq, rest.waveSpeed,
    rest.waveSharpness, rest.waveClamp, rest.waveCount, rest.waveLobeSharpness, rest.pixelRatio
  ])

  useImperativeHandle(ref, () => ({
    update: (patch) => {
      if (apiRef.current) {
        try {
          apiRef.current.update(patch)
        } catch (error) {
          console.error('Failed to update ParticleWaveSphere:', error)
        }
      }
    },
    resize: (w, h) => {
      if (apiRef.current && w > 0 && h > 0) {
        try {
          apiRef.current.resize(w, h)
        } catch (error) {
          console.error('Failed to resize ParticleWaveSphere:', error)
        }
      }
    },
    destroy: () => {
      if (apiRef.current) {
        try {
          apiRef.current.destroy()
        } catch (error) {
          console.error('Failed to destroy ParticleWaveSphere:', error)
        }
        apiRef.current = null
      }
    }
  }))

  return <div style={{ width, height, position:'relative' }}>
    <canvas ref={canvasRef} style={{ width:'100%', height:'100%', display:'block' }} />
  </div>
})
export default ParticleWaveSphere