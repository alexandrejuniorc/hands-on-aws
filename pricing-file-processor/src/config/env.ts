import { z } from "zod";

const envSchema = z.object({
  AWS_DEFAULT_REGION: z.string().default("us-east-2"),
  SECRET_NAME: z.string().default("hands-on-aws/database"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("production"),
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
});

export type Env = z.infer<typeof envSchema>;

function validateEnv(): Env {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join("\n");

      throw new Error(
        `❌ Invalid environment variables:\n${missingVars}\n\nPlease check your .env file or Lambda environment variables.`
      );
    }
    throw error;
  }
}

export const env = validateEnv();
