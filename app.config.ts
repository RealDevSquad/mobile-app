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
    plugins: [
      'expo-router',
      'expo-web-browser',
      [
        'expo-build-properties',
        {
          android: {
            abiFilters: ['arm64-v8a'],
            enableProguardInReleaseBuilds: true,
            enableShrinkResourcesInReleaseBuilds: true,
            usesCleartextTraffic: false,
            packagingOptions: {
              pickFirst: ['**/libc++_shared.so'],
            },
          },
        },
      ],
      './plugins/with-disable-apk-splits',
    ],
    android: {
      package: 'com.rds.mobileapp',
      versionCode: 1,
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      edgeToEdgeEnabled: true,
      permissions: [
        'android.permission.CAMERA',
        'android.permission.INTERNET',
        'android.permission.ACCESS_NETWORK_STATE',
      ],
    },
    ios: {
      bundleIdentifier: 'com.rds.mobileapp',
      supportsTablet: true,
    },
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/images/favicon.png',
    },
    orientation: 'portrait',
    icon: './assets/images/rdsLogoApk.png',
    userInterfaceStyle: 'automatic',
    newArchEnabled: false,
    assetBundlePatterns: [
      'assets/fonts/*',
      'assets/images/icon.png',
      'assets/images/adaptive-icon.png',
      'assets/images/splash-icon.png',
      'assets/images/rdsLogo.png',
      'assets/images/rdsXGithub.webp',
      'assets/images/favicon.png',
    ],
    splash: {
      image: './assets/images/splash-icon.png',
      imageWidth: 200,
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    experiments: {
      typedRoutes: true,
    },
    extra: {
      eas: {
        projectId: '9bc70082-9cfc-4d22-abf1-3b7d28ad53fc',
      },
    },
  },
};
