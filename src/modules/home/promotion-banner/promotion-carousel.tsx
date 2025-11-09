import React from "react";
import { Dimensions, View } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { promotionCards, PromotionCardData } from "./promotion-data";
import { PromotionCard } from "./promotion-card";
import styles from "./promotion.styles";

const AUTO_SCROLL_INTERVAL = 4000;
const CARD_HEIGHT = 180;
const HORIZONTAL_PADDING = 20;

export function PromotionCarousel() {
  const screenWidth = Dimensions.get("window").width;
  const cardWidth = screenWidth - HORIZONTAL_PADDING * 2;

  if (promotionCards.length === 0) {
    return null;
  }

  return (
    <View style={styles.carouselContainer}>
      <Carousel
        loop
        width={screenWidth}
        height={CARD_HEIGHT}
        autoPlay={promotionCards.length > 1}
        autoPlayInterval={AUTO_SCROLL_INTERVAL}
        data={promotionCards}
        scrollAnimationDuration={500}
        renderItem={({ item, index }: { item: PromotionCardData; index: number }) => (
          <View
            style={[styles.cardWrapper, { width: screenWidth, height: CARD_HEIGHT }]}
            accessibilityLabel={`Promotion card ${index + 1} of ${promotionCards.length}`}
          >
            <PromotionCard cardData={item} cardWidth={cardWidth} />
          </View>
        )}
      />
    </View>
  );
}
