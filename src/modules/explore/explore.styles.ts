import { StyleSheet } from "react-native";
import { ContainerStyles, Colors } from "../../styles/common.styles";

export default StyleSheet.create({
  container: ContainerStyles.white,
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerSection: {
    marginTop: 20,
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
  },
  subtext: {
    fontSize: 16,
    color: "#666",
  },
  placeholderSection: {
    marginTop: 20,
    padding: 20,
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 14,
    color: Colors.textLight,
  },
});
