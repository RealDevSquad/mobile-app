import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    marginTop: 48,
    paddingHorizontal: 20,
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    gap: 42,
    justifyContent: "space-between",
  },
  heading: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2937",
    textAlign: "center",
    lineHeight: 30,
    paddingHorizontal: 20,
  },
  description: {
    fontSize: 16,
    fontWeight: "400",
    color: "#1F2937",
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  imageContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    maxWidth: 350,
    height: 250,
    resizeMode: "contain",
  },
});
