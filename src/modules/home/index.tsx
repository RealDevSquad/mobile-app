import { ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FeatureSection } from "./feature-section";
import { HomeHeader } from "./home-header";
import { PromotionCarousel } from "./promotion-banner/promotion-carousel";
import styles from "./home.styles";

export function HomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]}>
      <HomeHeader />
      <PromotionCarousel />
      <FeatureSection />
    </ScrollView>
  );
}
