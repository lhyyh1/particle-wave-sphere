// src/particleWaveSphere.js

// 参数验证函数
function validateOptions(options) {
  if (!options) return {};
  const validated = {};
  if (typeof options.width === 'number' && options.width > 0) validated.width = options.width;
  if (typeof options.height === 'number' && options.height > 0) validated.height = options.height;
  if (typeof options.backgroundColor === 'string') validated.backgroundColor = options.backgroundColor;
  if (typeof options.rotationSpeed === 'number') validated.rotationSpeed = options.rotationSpeed;
  if (typeof options.pointSize === 'number' && options.pointSize > 0) validated.pointSize = options.pointSize;
  if (typeof options.sticky === 'number') validated.sticky = options.sticky;
  if (typeof options.colorA === 'string') validated.colorA = options.colorA;
  if (typeof options.colorB === 'string') validated.colorB = options.colorB;
  if (typeof options.waveAmp === 'number') validated.waveAmp = options.waveAmp;
  if (typeof options.waveFreq === 'number') validated.waveFreq = options.waveFreq;
  if (typeof options.waveSpeed === 'number') validated.waveSpeed = options.waveSpeed;
  if (typeof options.waveSharpness === 'number') validated.waveSharpness = options.waveSharpness;
  if (typeof options.waveClamp === 'number') validated.waveClamp = options.waveClamp;
  if (typeof options.waveCount === 'number') validated.waveCount = Math.max(1, Math.min(8, Math.floor(options.waveCount)));
  if (typeof options.waveLobeSharpness === 'number') validated.waveLobeSharpness = options.waveLobeSharpness;
  if (typeof options.pixelRatio === 'number' && options.pixelRatio > 0) validated.pixelRatio = options.pixelRatio;
  return validated;
}

// 透视投影矩阵计算（提取为独立函数，避免重复）
function perspective(out, fovy, aspect, near, far) {
  const f = 1.0 / Math.tan(fovy / 2);
  out[0] = f / aspect; out[1] = 0; out[2] = 0; out[3] = 0;
  out[4] = 0; out[5] = f; out[6] = 0; out[7] = 0;
  out[8] = 0; out[9] = 0; out[10] = (far + near) / (near - far); out[11] = -1;
  out[12] = 0; out[13] = 0; out[14] = (2 * far * near) / (near - far); out[15] = 0;
  return out;
}

export function createParticleWaveSphere(canvas, options = {}) {
  // 验证 canvas 元素
  if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
    throw new Error('Invalid canvas element provided');
  }

  const validatedOptions = validateOptions(options);
  const opt = Object.assign({
    width: 300,
    height: 300,
    backgroundColor: 'transparent',
    rotationSpeed: 0.4,
    pointSize: 1.6,
    sticky: 0.75,
    colorA: '#ffffff',
    colorB: '#ffffff',
    waveAmp: 0.14,
    waveFreq: 6.2,
    waveSpeed: 0.8,
    waveSharpness: 1.6,
    waveClamp: 0.20,
    waveCount: 5,           // 1..8
    waveLobeSharpness: 14,  // 10..20
    pixelRatio: (typeof devicePixelRatio !== 'undefined' ? Math.min(devicePixelRatio, 2) : 1)
  }, validatedOptions);

  function hex2rgb(hex) {
    if (!hex || hex === 'transparent') return [1,1,1];
    const s = hex.replace('#','');
    const h = s.length===3 ? s.split('').map(c=>c+c).join('') : s;
    return [parseInt(h.slice(0,2),16)/255, parseInt(h.slice(2,4),16)/255, parseInt(h.slice(4,6),16)/255];
  }
  function fibonacciSphereDirs(n){
    const out = []; const N = Math.max(1, n|0);
    for(let i=0;i<N;i++){
      const k = -1 + (2*i + 1)/N;
      const phi = Math.acos(k);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const x = Math.sin(phi) * Math.cos(theta);
      const y = Math.sin(phi) * Math.sin(theta);
      const z = Math.cos(phi);
      out.push([x,y,z]);
    }
    return out;
  }

  const gl = canvas.getContext('webgl', {
    antialias: true,
    alpha: opt.backgroundColor === 'transparent'
  });
  if (!gl) {
    throw new Error('WebGL not available. Your browser or device may not support WebGL.');
  }

  const DPR = Math.min(opt.pixelRatio || 1, 2);
  function setSize(w,h){
    canvas.width = Math.floor(w * DPR);
    canvas.height = Math.floor(h * DPR);
    gl.viewport(0,0,canvas.width,canvas.height);
  }
  setSize(opt.width, opt.height);

  if (opt.backgroundColor === 'transparent') gl.clearColor(0,0,0,0);
  else { const [r,g,b] = hex2rgb(opt.backgroundColor); gl.clearColor(r,g,b,1); }
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
  gl.disable(gl.DEPTH_TEST);

  const VS = `
  #define MAX_WAVES 8
  attribute vec3 aPos;
  uniform mat4 uProj, uView, uModel;
  uniform float uPointSize, uTime;
  uniform float uWaveAmp, uWaveFreq, uWaveSpeed, uWaveSharpness, uWaveClamp;
  uniform float uLobeSharp;
  uniform int   uWaveCount;
  uniform vec3  uWaves[MAX_WAVES];
  uniform float uWaveSpeedMul[MAX_WAVES];
  uniform float uWaveWeight[MAX_WAVES];
  uniform float uSticky;
  varying float vViewZ, vMix, vWave;
  float lobe(vec3 n, vec3 d, float sharp){
    float c = max(0.0, dot(n, d));
    float s = 1.0 - c;
    return exp(-sharp * s * s);
  }
  float surfaceWave(vec3 dir, float t){
    float w = 0.0;
    for (int i = 0; i < MAX_WAVES; i++) {
      if (i < uWaveCount) {
        float phase = uWaveFreq * dot(dir, uWaves[i]) + t * uWaveSpeed * uWaveSpeedMul[i];
        w += lobe(dir, uWaves[i], uLobeSharp) * sin(phase) * uWaveWeight[i];
      }
    }
    return w / 2.6;
  }
  void main(){
    vec3 dir = normalize(aPos);
    float w = surfaceWave(dir, uTime);
    float s = sign(w) * pow(abs(w), uWaveSharpness);
    float disp = 1.0 + uWaveAmp * s;
    disp = clamp(disp, 1.0 - uWaveClamp, 1.0 + uWaveClamp);
    vec3 pos = dir * disp;
    vMix  = clamp(pos.y * 0.5 + 0.5 + 0.10 * s, 0.0, 1.0);
    vWave = s;
    vec4 world = uModel * vec4(pos, 1.0);
    vec4 view  = uView  * world;
    vViewZ = -view.z;
    float ps = uPointSize * (1.0 + uSticky * max(0.0, s));
    gl_PointSize = max(1.0, ps);
    gl_Position = uProj * view;
  }`;

  const FS = `
  precision mediump float;
  varying float vViewZ, vMix, vWave;
  uniform vec3 uColorA, uColorB;
  void main(){
    vec2 uv = gl_PointCoord*2.0 - 1.0;
    float d2 = dot(uv, uv);
    if (d2 > 1.0) discard;
    float edge = 1.0 - smoothstep(0.72, 1.0, d2);
    float depthBoost = clamp(vViewZ * 0.15, 0.0, 1.0);
    vec3 col = mix(uColorA, uColorB, vMix);
    float waveLight = 0.85 + 0.60 * max(0.0, vWave);
    float I = (0.30 + 0.70*edge) * (0.65 + 0.35*depthBoost) * waveLight;
    gl_FragColor = vec4(col * I, I);
  }`;

  function compile(type, src){
    const sh = gl.createShader(type);
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      throw new Error(gl.getShaderInfoLog(sh) || 'shader compile failed');
    }
    return sh;
  }
  const prog = gl.createProgram();
  gl.attachShader(prog, compile(gl.VERTEX_SHADER, VS));
  gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FS));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(prog) || 'program link failed');
  }
  gl.useProgram(prog);

  const uProj = gl.getUniformLocation(prog, 'uProj');
  const uView = gl.getUniformLocation(prog, 'uView');
  const uModel = gl.getUniformLocation(prog, 'uModel');
  const uPointSize = gl.getUniformLocation(prog, 'uPointSize');
  const uTime = gl.getUniformLocation(prog, 'uTime');
  const uWaveAmp = gl.getUniformLocation(prog, 'uWaveAmp');
  const uWaveFreq = gl.getUniformLocation(prog, 'uWaveFreq');
  const uWaveSpeed = gl.getUniformLocation(prog, 'uWaveSpeed');
  const uWaveSharp = gl.getUniformLocation(prog, 'uWaveSharpness');
  const uWaveClamp = gl.getUniformLocation(prog, 'uWaveClamp');
  const uLobeSharp = gl.getUniformLocation(prog, 'uLobeSharp');
  const uWaveCount = gl.getUniformLocation(prog, 'uWaveCount');
  const uWaves = Array.from({length:8},(_,i)=> gl.getUniformLocation(prog, `uWaves[${i}]`));
  const uWaveSpeedMul = Array.from({length:8},(_,i)=> gl.getUniformLocation(prog, `uWaveSpeedMul[${i}]`));
  const uWaveWeight = Array.from({length:8},(_,i)=> gl.getUniformLocation(prog, `uWaveWeight[${i}]`));
  const uSticky = gl.getUniformLocation(prog, 'uSticky');
  const uColorA = gl.getUniformLocation(prog, 'uColorA');
  const uColorB = gl.getUniformLocation(prog, 'uColorB');
  const aPos = gl.getAttribLocation(prog, 'aPos');

  const COUNT = 4200;
  const pos = new Float32Array(COUNT * 3);
  for (let i=0;i<COUNT;i++){
    const k = -1 + (2*i + 1)/COUNT;
    const phi = Math.acos(k);
    const theta = Math.PI * (1 + Math.sqrt(5)) * i;
    pos[i*3+0] = Math.sin(phi)*Math.cos(theta);
    pos[i*3+1] = Math.sin(phi)*Math.sin(theta);
    pos[i*3+2] = Math.cos(phi);
  }
  const vbo = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
  gl.bufferData(gl.ARRAY_BUFFER, pos, gl.STATIC_DRAW);
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 0, 0);

  function translateZ(out, z) { 
    out.set([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, z, 1]); 
    return out; 
  }
  function rotY(out, a) { 
    const c = Math.cos(a), s = Math.sin(a);
    out.set([c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1]); 
    return out; 
  }

  const matProj = perspective(new Float32Array(16), 45 * Math.PI / 180, canvas.width / canvas.height, 0.1, 100);
  const matView  = translateZ(new Float32Array(16), -3.0);
  const matModel = new Float32Array(16);
  gl.uniformMatrix4fv(uProj, false, matProj);
  gl.uniformMatrix4fv(uView, false, matView);

  const [r1,g1,b1] = hex2rgb(opt.colorA);
  const [r2,g2,b2] = hex2rgb(opt.colorB);
  gl.uniform3f(uColorA, r1,g1,b1);
  gl.uniform3f(uColorB, r2,g2,b2);
  gl.uniform1f(uPointSize, Math.max(1.0, opt.pointSize * Math.min(opt.pixelRatio||1,2)));
  gl.uniform1f(uWaveAmp, opt.waveAmp);
  gl.uniform1f(uWaveFreq, opt.waveFreq);
  gl.uniform1f(uWaveSpeed, opt.waveSpeed);
  gl.uniform1f(uWaveSharp, opt.waveSharpness);
  gl.uniform1f(uWaveClamp, opt.waveClamp);
  gl.uniform1f(uLobeSharp, opt.waveLobeSharpness);
  gl.uniform1f(uSticky, opt.sticky);

  function applyWaveUniforms(){
    const wc = Math.max(1, Math.min(8, opt.waveCount|0));
    const dirs = fibonacciSphereDirs(wc);
    const spm = [1.00,1.28,0.82,1.12,0.95,0.9,1.35,0.75];
    const wts = [1.00,0.90,0.80,0.85,0.88,0.78,0.82,0.86];
    for (let i=0;i<8;i++){
      const d = dirs[i] || [0,0,1];
      gl.uniform3f(uWaves[i], d[0], d[1], d[2]);
      gl.uniform1f(uWaveSpeedMul[i], spm[i] || 0.0);
      gl.uniform1f(uWaveWeight[i], wts[i] || 0.0);
    }
    gl.uniform1i(uWaveCount, wc);
  }
  applyWaveUniforms();

  const rafFun = (typeof requestAnimationFrame !== 'undefined' ? requestAnimationFrame : null);
  const cafFun = (typeof cancelAnimationFrame !== 'undefined' ? cancelAnimationFrame : null);
  const raf = (fn) => rafFun ? rafFun(fn) : setTimeout(fn, 16);
  const caf = (id) => cafFun ? cafFun(id) : clearTimeout(id);
  const t0 = Date.now();
  let rafId = 0, running = true;
  function frame(){
    if (!running) return;
    gl.useProgram(prog);
    const t = (Date.now() - t0)/1000;
    rotY(matModel, t * opt.rotationSpeed);
    gl.uniformMatrix4fv(uModel, false, matModel);
    gl.uniform1f(uTime, t);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, COUNT);
    rafId = raf(frame);
  }
  frame();

  return {
    update(patch = {}) {
      if (!patch || typeof patch !== 'object') {
        console.warn('Invalid update patch provided');
        return;
      }
      const validatedPatch = validateOptions(patch);
      Object.assign(opt, validatedPatch);
      if (validatedPatch.backgroundColor){
        if (opt.backgroundColor === 'transparent') gl.clearColor(0,0,0,0);
        else { const [r,g,b] = hex2rgb(opt.backgroundColor); gl.clearColor(r,g,b,1); }
      }
      if (validatedPatch.colorA){ const [r,g,b] = hex2rgb(opt.colorA); gl.uniform3f(uColorA, r,g,b); }
      if (validatedPatch.colorB){ const [r,g,b] = hex2rgb(opt.colorB); gl.uniform3f(uColorB, r,g,b); }
      if (validatedPatch.pointSize != null) gl.uniform1f(uPointSize, Math.max(1.0, opt.pointSize * Math.min(opt.pixelRatio||1,2)));
      if (validatedPatch.sticky != null) gl.uniform1f(uSticky, opt.sticky);
      if (validatedPatch.waveAmp != null) gl.uniform1f(uWaveAmp, opt.waveAmp);
      if (validatedPatch.waveFreq != null) gl.uniform1f(uWaveFreq, opt.waveFreq);
      if (validatedPatch.waveSpeed != null) gl.uniform1f(uWaveSpeed, opt.waveSpeed);
      if (validatedPatch.waveSharpness != null) gl.uniform1f(uWaveSharp, opt.waveSharpness);
      if (validatedPatch.waveClamp != null) gl.uniform1f(uWaveClamp, opt.waveClamp);
      if (validatedPatch.waveLobeSharpness != null) gl.uniform1f(uLobeSharp, opt.waveLobeSharpness);
      if (validatedPatch.waveCount != null) applyWaveUniforms();
    },
    resize(w, h) {
      if (typeof w !== 'number' || typeof h !== 'number' || w <= 0 || h <= 0) {
        console.warn('Invalid resize parameters:', w, h);
        return;
      }
      try {
        setSize(w, h);
        const out = new Float32Array(16);
        perspective(out, 45 * Math.PI / 180, canvas.width / canvas.height, 0.1, 100);
        gl.uniformMatrix4fv(uProj, false, out);
      } catch (error) {
        console.error('Failed to resize:', error);
      }
    },
    destroy() {
      running = false;
      try {
        if (caf && rafId) {
          caf(rafId);
        }
        rafId = 0;
      } catch (e) {
        console.error('Error canceling animation frame:', e);
      }
    },
    _gl: gl
  };
}