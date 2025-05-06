import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

// Access environment variables
const apiUrl = process.env.EXPO_PUBLIC_API_URL;
const apiKey = process.env.EXPO_PUBLIC_API_KEY;
const testVar = process.env.EXPO_PUBLIC_TEST_VAR;

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={styles.text}>Welcome to RDS mobile app</Text>
      <Text>API URL: {apiUrl}</Text>
      <Text>API Key: {apiKey}</Text>
      <Text>Env Test: {testVar}</Text>

      <Link href="/profile" style={styles.button}>
        Go to Profile screen
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    paddingBottom: 10,
  },
  button: {
    fontSize: 12,
    textDecorationLine: "underline",
  },
});
