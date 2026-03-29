/**
 * @module EnvConfig
 * Environment variables validation and configuration.
 */
import dotenv from "dotenv";
import { z } from "zod";
import logger from "../utils/pino-logger.js";

dotenv.config();

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
  const errors = _env.error.issues.map((issue) => ({
    variable: issue.path.join("."),
    message: issue.message,
  }));

  logger.fatal({ errors }, "❌ Invalid environment variables configuration");
  process.exit(1);
}

// Critical production security check
if (_env.data.NODE_ENV === "production" && _env.data.JWT_SECRET === "default_fallback_secret") {
  logger.fatal(
    { node_env: _env.data.NODE_ENV },
    "❌ FATAL: JWT_SECRET must be a unique secure string in production!"
  );
  process.exit(1);
}

export const ENV = _env.data;
export type DbType = z.infer<typeof envSchema>["DB_TYPE"];