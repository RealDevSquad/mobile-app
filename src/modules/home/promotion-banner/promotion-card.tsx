import * as WebBrowser from "expo-web-browser";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { PromotionCardData } from "./promotion-data";
import styles from "./promotion.styles";

type PromotionCardProps = {
  cardData: PromotionCardData;
  cardWidth: number;
};

export function PromotionCard({ cardData, cardWidth }: PromotionCardProps) {
  const handlePress = () => {
    WebBrowser.openBrowserAsync(cardData.url);
  };

  return (
    <TouchableOpacity
      style={[styles.card, { width: cardWidth }]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <View style={styles.cardContent}>
        <View>
          <Text style={styles.cardTitle} numberOfLines={1} ellipsizeMode="tail">
            {cardData.title}
          </Text>
        </View>
        <Text style={styles.cardDescription} numberOfLines={4} ellipsizeMode="tail">
          {cardData.description}
        </Text>
        <View style={styles.viewMoreContainer}>
          <Text style={styles.viewMoreText}>View more →</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
