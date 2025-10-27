import * as dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const configSchema = z.object({
  EXPO_PUBLIC_API_URL: z.string().url(),
  EXPO_PUBLIC_API_KEY: z.string().optional(),
  APP_ENV: z
    .enum(['development', 'staging', 'production'])
    .default('development'),
});

export const validateEnv = () => {
  const result = configSchema.safeParse(process.env);
  const errors = result.error?.flatten().fieldErrors;

  if (!result.success) {
    throw new Error(
      JSON.stringify(
        {
          message: 'Error loading config',
          errors,
        },
        null,
        2
      )
    );
  }

  return result.data;
};

const validatedEnv = validateEnv();
export const ENV = validatedEnv.APP_ENV;

export default {
  expo: {
    name: 'RDSApp',
    slug: 'rds-app',
    scheme: 'rdsapp',
    version: '1.0.0',
    apiUrl: validatedEnv.EXPO_PUBLIC_API_URL,
    apiKey: validatedEnv.EXPO_PUBLIC_API_KEY,
    environment: ENV,
  },
};
