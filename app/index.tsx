import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

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
