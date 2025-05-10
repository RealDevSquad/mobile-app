import { isDev } from "@/constants/utils";
import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to RDS mobile app</Text>

      {isDev() && (
        <Text style={styles.text}>This is the development version</Text>
      )}

      <Link href="/profile" style={styles.button}>
        Go to Profile screen
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    paddingBottom: 10,
    fontSize: 18,
    fontWeight: "bold",
  },
  button: {
    marginTop: 10,
    fontSize: 12,
    textDecorationLine: "underline",
  },
});