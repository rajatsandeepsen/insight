import { defineConfig } from 'drizzle-kit'

export default defineConfig({
    schema: "./database/schema.ts",
    dbCredentials: {
        url: process.env.DATABASE_URL as string
    },
    dialect: 'postgresql',
    migrations: {
        prefix: 'supabase'
    }
})