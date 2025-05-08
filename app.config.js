import * as dotenv from "dotenv";
import * as fs from "fs";

const ENV = process.env.APP_ENV || "development";
const envFile = `.env.${ENV}`;

if (fs.existsSync(envFile)) {
  dotenv.config({ path: envFile });
}

export default {
  name: "RDSApp",
  slug: "rds-app",
  scheme: "rdsapp" ,
  version: "1.0.0",
  extra: {
    apiUrl: process.env.EXPO_PUBLIC_API_URL,
    apiKey: process.env.EXPO_PUBLIC_API_KEY,
    environment: ENV,
  },
};
