import Constants from "expo-constants";
import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

const { apiUrl, apiKey, environment } = Constants.expoConfig?.extra ?? {};


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

      {__DEV__ ? (
        <Text style={styles.text}>This is the development version</Text>
      ) : null
}

      <Text style={styles.env}>API URL: {apiUrl}</Text>
      <Text style={styles.env}>API Key: {apiKey}</Text>
      <Text style={styles.env}>Environment: {environment}</Text>

      <Link href="/profile" style={styles.button}>
        Go to Profile screen
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    paddingBottom: 10,
    fontSize: 18,
    fontWeight: "bold",
  },
  env: {
    fontSize: 12,
    paddingBottom: 4,
  },
  button: {
    marginTop: 10,
    fontSize: 12,
    textDecorationLine: "underline",
  },
});
