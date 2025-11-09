import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuthStore } from "../../store/authStore";
import { CreateTaskSection } from "./create-task";
import styles from "./explore.styles";

export function ExploreModule() {
  const insets = useSafeAreaInsets();
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Text style={styles.text}>Explore Screen</Text>
        <Text style={styles.subtext}>Please sign in to continue</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerSection}>
          <Text style={styles.title}>Explore</Text>
          <Text style={styles.subtitle}>Discover and create tasks</Text>
        </View>

        <CreateTaskSection />

        <View style={styles.placeholderSection}>
          <Text style={styles.placeholderText}>More features coming soon...</Text>
        </View>
      </ScrollView>
    </View>
  );
}
