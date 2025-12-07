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
// TODO: Change to the actual URL
const EXPO_TOKEN_URL = "https://b2bbbec12978.ngrok-free.app/api/expo-tokens/";

export default function usePushToken(userId: string | null) {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);

  useEffect(() => {
    async function register() {
      try {
        const { status } = await Notifications.requestPermissionsAsync();

        if (status !== "granted") {
          return;
        }

        const projectId = Constants.expoConfig?.extra?.eas?.projectId;

        if (!projectId) {
          return;
        }

        const tokenData = await Notifications.getExpoPushTokenAsync({ projectId });
        const token = tokenData.data;
        setExpoPushToken(token);

        if (Platform.OS === "android") {
          await Notifications.setNotificationChannelAsync("default", {
            name: "default",
            importance: Notifications.AndroidImportance.MAX,
          });
        }
      } catch (error) {
        logger.error("Error registering push token", error);
      }
    }

    register();
  }, [userId]);

  useEffect(() => {
    if (!expoPushToken || !userId) return;

    const requestBody = {
      user_id: userId,
      expo_token: expoPushToken,
    };

    fetch(EXPO_TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    }).catch(() => {
      logger.error("Failed to send token to backend");
    });
  }, [expoPushToken, userId]);

  return expoPushToken;
}
