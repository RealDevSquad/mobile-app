import { ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import usePushToken from "../../hooks/usePushToken";
import { FeatureSection } from "./feature-section";
import { HomeHeader } from "./home-header";
import { PromotionCarousel } from "./promotion-banner/promotion-carousel";
import styles from "./home.styles";

export function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { data: user } = useCurrentUser();
  usePushToken(user?.id ?? null);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#ffffff" }}
      contentContainerStyle={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom + 20 },
      ]}
      showsVerticalScrollIndicator={true}
      bounces={true}
    >
      <HomeHeader />
      <PromotionCarousel />
      <FeatureSection />
    </ScrollView>
  );
}
