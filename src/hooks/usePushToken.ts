import Constants from "expo-constants";
import * as Notifications from "expo-notifications";

import { useEffect, useState } from "react";

import { Platform } from "react-native";
import { logger } from "../utils/logger";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const EXPO_TOKEN_URL = "https://b2bbbec12978.ngrok-free.app/api/expo-tokens/";

export default function usePushToken(userId: string | null) {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);

  useEffect(() => {
    async function register() {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") return;

      const projectId = Constants.expoConfig?.extra?.eas?.projectId;
      if (!projectId) {
        logger.warn("Push notifications require a projectId", null, "PushToken");
        return;
      }
      const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
      logger.info("Expo Push Token obtained", { token }, "PushToken");
      setExpoPushToken(token);

      if (Platform.OS === "android") {
        Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
        });
      }
    }

    register();
  }, []);

  useEffect(() => {
    if (!expoPushToken || !userId) return;

    const requestBody = {
      user_id: userId,
      expo_token: expoPushToken,
    };

    logger.apiRequest("POST", "/api/expo-tokens/", requestBody);

    fetch(EXPO_TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    })
      .then(async (response) => {
        const data = await response.json().catch(() => null);
        logger.apiResponse("POST", "/api/expo-tokens/", response.status, data);
      })
      .catch((error) => {
        logger.apiError("POST", "/api/expo-tokens/", error?.message || error);
      });
  }, [expoPushToken, userId]);

  return expoPushToken;
}
