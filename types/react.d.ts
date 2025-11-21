import type { ParticleWaveSphereOptions, ParticleWaveSphereAPI } from './index'

export interface ParticleWaveSphereReactProps extends ParticleWaveSphereOptions {}
export interface ParticleWaveSphereReactRef {
  update(patch?: Partial<ParticleWaveSphereOptions>): void
  resize(width: number, height: number): void
  destroy(): void
}

declare const ParticleWaveSphere: import('react').ForwardRefExoticComponent<
  ParticleWaveSphereReactProps & import('react').RefAttributes<ParticleWaveSphereReactRef>
>
export default ParticleWaveSphere
export { ParticleWaveSphere }