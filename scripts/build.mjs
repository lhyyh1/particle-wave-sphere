// scripts/build.mjs
import { build } from 'esbuild';
const banner = `/*! particle-wave-sphere | MIT License */`;
async function go() {
  await build({
    entryPoints: ['src/index.js'],
    bundle: true,
    format: 'esm',
    outfile: 'dist/index.mjs',
    sourcemap: true,
    target: ['es2019'],
    banner: { js: banner },
    minify: false
  });
  await build({
    entryPoints: ['src/index.js'],
    bundle: true,
    format: 'cjs',
    outfile: 'dist/index.cjs',
    sourcemap: true,
    target: ['es2019'],
    banner: { js: banner },
    minify: false
  });
  console.log('Built dist/index.mjs and dist/index.cjs');
}
go().catch((e)=>{ console.error(e); process.exit(1); });

