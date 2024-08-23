import * as esbuild from 'esbuild'

await esbuild.build({
    entryPoints: ['./index.ts'],
    bundle: true,
    outdir: './',
    platform: "node",
    format: "esm",
    minify: true,
    packages: "external",
})