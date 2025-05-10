import Constants from "expo-constants";

const { environment } = Constants.expoConfig?.extra ?? {};

export const isDev = () => environment === "development";
export const isProd = () => environment === "production";