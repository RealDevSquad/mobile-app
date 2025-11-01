import { theme } from '@/constants/theme';
import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import InfoCard from './InfoCard';

export type CardData = {
  title: string;
  description: string;
  url: string;
};

type InfoCarouselProps = {
  cards: CardData[];
  autoScrollInterval?: number;
};

const AUTO_SCROLL_INTERVAL = 4000;

const InfoCarousel: React.FC<InfoCarouselProps> = ({
  cards,
  autoScrollInterval = AUTO_SCROLL_INTERVAL,
}) => {
  const screenWidth = Dimensions.get('window').width;

  if (cards.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Carousel
        loop
        width={screenWidth}
        height={160}
        autoPlay={cards.length > 1}
        autoPlayInterval={autoScrollInterval}
        data={cards}
        scrollAnimationDuration={500}
        renderItem={({ item, index }) => (
          <View
            style={styles.cardWrapper}
            accessibilityLabel={`Information card ${index + 1} of ${cards.length}`}
          >
            <InfoCard
              title={item.title}
              description={item.description}
              url={item.url}
            />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: theme.spacing.sm,
  },
  cardWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default InfoCarousel;
