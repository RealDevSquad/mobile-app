import { StyleSheet } from "react-native";

export default StyleSheet.create({
  carouselContainer: {
    marginTop: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  cardWrapper: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    height: 180,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#F5F3FF",
    shadowColor: "#E30464",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
    overflow: "hidden",
  },
  cardContent: {
    flex: 1,
    justifyContent: "space-between",
    width: "100%",
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#E30464",
    marginBottom: 12,
    textDecorationLine: "underline",
    textDecorationColor: "#E30464",
  },
  cardDescription: {
    fontSize: 14,
    fontWeight: "400",
    color: "#1F2937",
    lineHeight: 20,
    flex: 1,
    width: "100%",
    marginBottom: 12,
  },
  viewMoreContainer: {
    alignItems: "flex-end",
    width: "100%",
  },
  viewMoreText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#E30464",
  },
});
