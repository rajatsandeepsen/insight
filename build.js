import * as esbuild from 'esbuild'

await esbuild.build({
    entryPoints: ['./index.ts'],
    bundle: true,
    outdir: './',
    minify: true,
    external: [
        "@ai-sdk/openai",
        "@upstash/redis",
        "ai",
        "jimp",
        "json-2-csv",
        "jsonwebtoken",
        "jsqr",
        "qrcode-terminal",
        "whatsapp-web.js",
        "zod",
    ]
})