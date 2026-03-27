/**
 * @module EnvConfig
 * Environment variables validation and configuration.
 */
import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

/**
 * Validation schema for environment variables.
 * Uses z.coerce to ensure types match (e.g., string from .env to number).
 */
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(3000),
  JWT_SECRET: z.string().min(8, "JWT_SECRET must be at least 8 characters"),
  JWT_EXPIRES_IN: z.string().default("2h"),
  DB_TYPE: z.enum(["IN_MEMORY", "PRISMA", "MONGODB"]).default("IN_MEMORY"),
});

// Parse and validate process.env
const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("❌ Invalid environment variables:", _env.error.format());
  process.exit(1);
}

// Critical production security check
if (_env.data.NODE_ENV === "production" && _env.data.JWT_SECRET === "default_fallback_secret") {
  console.error("❌ FATAL: JWT_SECRET must be a unique secure string in production!");
  process.exit(1);
}

/**
 * Validated environment configuration object.
 */
export const ENV = _env.data;

export type DbType = z.infer<typeof envSchema>["DB_TYPE"];