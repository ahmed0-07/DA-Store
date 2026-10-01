import dotenv from "dotenv"
import { z } from "zod"

dotenv.config()

const envSchema = z.object({
  PORT: z.coerce.number(),
  NODE_ENV: z.string(),
  DATABASE_URL: z.string().url(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  JWT_SECRET: z.string()
})

const res = envSchema.safeParse(process.env)

if (!res.success) {
  console.error("❌ Invalid environment variables:");
  console.error(res.error.flatten().fieldErrors);
  process.exit(1);
}

export default res.data