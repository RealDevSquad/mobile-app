import React from "react";
import { Image, Text, View } from "react-native";
import styles from "./feature.styles";

export function FeatureSection() {
  const imageSource = require("../../../../assets/images/clumsy.png");

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={imageSource} style={styles.image} resizeMode="contain" />
      </View>
      <Text style={styles.heading}>Stop Juggling Multiple Tools.</Text>
      <Text style={styles.description}>
        All-in-one platform for task management, project tracking, and collaboration.
      </Text>
    </View>
  );
}
