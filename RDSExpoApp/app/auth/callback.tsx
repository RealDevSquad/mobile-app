import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

export default function AuthCallback() {
  const router = useRouter();
  const params = useLocalSearchParams();

  useEffect(() => {
    console.log("🔗 Received Callback Params:", params);
    const token = params?.token as string | undefined;
    if (token) {
      console.log("GitHub Auth Token Received:", token);
      
      router.replace("/screens/HomeScreen");
    } else {
      console.error("No token found in deep link.");
     
      router.replace("/screens/AuthScreen");
    }
  }, [params]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Processing authentication...</Text>
      <ActivityIndicator size="large" color="#ffffff" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1200AA",
  },
  text: {
    color: "white",
    fontSize: 18,
  },
});
