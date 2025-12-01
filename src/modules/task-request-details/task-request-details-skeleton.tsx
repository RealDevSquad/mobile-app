import React, { useEffect, useRef } from "react";
import { Animated, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import styles from "./task-request-details-skeleton.styles";

export function TaskRequestDetailsSkeleton() {
  const insets = useSafeAreaInsets();
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const shimmer = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    shimmer.start();
    return () => shimmer.stop();
  }, [shimmerAnim]);

  const opacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerSection}>
          <View style={styles.headerContent}>
            <Animated.View style={[styles.backButton, { opacity }]} />
            <View style={styles.titleContainer}>
              <Animated.View style={[styles.skeletonLine, styles.titleLine, { opacity }]} />
              <Animated.View style={[styles.skeletonLine, styles.titleLineShort, { opacity }]} />
            </View>
            <Animated.View style={[styles.shareButton, { opacity }]} />
          </View>
        </View>

        <View style={styles.contentSection}>
          <View style={styles.detailsCard}>
            <View style={styles.detailRow}>
              <View style={styles.detailLabelContainer}>
                <Animated.View style={[styles.iconPlaceholder, { opacity }]} />
                <Animated.View style={[styles.skeletonLine, styles.labelLine, { opacity }]} />
              </View>
              <Animated.View style={[styles.statusBadge, { opacity }]} />
            </View>

            <View style={styles.detailRow}>
              <View style={styles.detailLabelContainer}>
                <Animated.View style={[styles.iconPlaceholder, { opacity }]} />
                <Animated.View style={[styles.skeletonLine, styles.labelLine, { opacity }]} />
              </View>
              <Animated.View style={[styles.skeletonLine, styles.valueLine, { opacity }]} />
            </View>

            <View style={styles.detailRow}>
              <View style={styles.detailLabelContainer}>
                <Animated.View style={[styles.iconPlaceholder, { opacity }]} />
                <Animated.View style={[styles.skeletonLine, styles.labelLine, { opacity }]} />
              </View>
              <Animated.View style={[styles.skeletonLine, styles.valueLine, { opacity }]} />
            </View>

            <View style={styles.detailRow}>
              <View style={styles.detailLabelContainer}>
                <Animated.View style={[styles.iconPlaceholder, { opacity }]} />
                <Animated.View style={[styles.skeletonLine, styles.labelLine, { opacity }]} />
              </View>
              <Animated.View style={[styles.skeletonLine, styles.valueLine, { opacity }]} />
            </View>
          </View>

          <View style={styles.githubSection}>
            <Animated.View style={[styles.githubButton, { opacity }]} />
          </View>

          <View style={styles.usersSection}>
            <Animated.View style={[styles.skeletonLine, styles.usersTitleLine, { opacity }]} />
            <Animated.View style={[styles.userCard, { opacity }]} />
            <Animated.View style={[styles.userCard, { opacity }]} />
            <Animated.View style={[styles.userCard, { opacity }]} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
