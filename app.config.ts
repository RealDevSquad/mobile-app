import * as dotenv from "dotenv";
import { z } from "zod";

// Load the single .env file
dotenv.config();

// Define a schema for environment variables
const configSchema = z.object({
  EXPO_PUBLIC_API_URL: z.string().url(),
  EXPO_PUBLIC_API_KEY: z.string().min(1),
  APP_ENV: z.enum(["development", "staging", "production"]).default("development"),
});

// Validate the environment variables
export const validateEnv = () => {
  const result = configSchema.safeParse(process.env);
  const errors = result.error?.flatten().fieldErrors;

  if (!result.success) {
    throw new Error(
      JSON.stringify(
        {
          message: "Error loading config",
          errors,
        },
        null,
        2
      )
    );
  }

  return result.data;
};

// Validate and load the environment variables
const validatedEnv = validateEnv();

export const ENV = validatedEnv.APP_ENV;

export const config = {
  name: "RDSApp",
  slug: "rds-app",
  scheme: "rdsapp",
  version: "1.0.0",
  apiUrl: validatedEnv.EXPO_PUBLIC_API_URL,
  apiKey: validatedEnv.EXPO_PUBLIC_API_KEY,
  environment: ENV,
};