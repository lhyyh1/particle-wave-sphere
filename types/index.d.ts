export interface Options {
  width?: number; height?: number; backgroundColor?: string;
  rotationSpeed?: number; pointSize?: number; sticky?: number;
  colorA?: string; colorB?: string;
  waveAmp?: number; waveFreq?: number; waveSpeed?: number;
  waveSharpness?: number; waveClamp?: number;
  waveCount?: number; waveLobeSharpness?: number; pixelRatio?: number;
}
export interface API { update(patch?: Partial<Options>): void; resize(w:number,h:number):void; destroy():void; }
export function createParticleWaveSphere(canvas: HTMLCanvasElement, options?: Options): API;
