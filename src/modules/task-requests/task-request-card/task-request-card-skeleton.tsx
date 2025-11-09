import React, { useEffect, useRef } from "react";
import { Animated, View } from "react-native";
import styles from "./task-request-card-skeleton.styles";

export function TaskRequestCardSkeleton() {
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
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.titleContainer}>
          <Animated.View style={[styles.skeletonLine, styles.titleLine, { opacity }]} />
          <Animated.View style={[styles.skeletonLine, styles.titleLineShort, { opacity }]} />
        </View>
        <Animated.View style={[styles.statusBadge, { opacity }]} />
      </View>

      <View style={styles.cardBody}>
        <View style={styles.infoRow}>
          <Animated.View style={[styles.skeletonLine, styles.labelLine, { opacity }]} />
          <Animated.View style={[styles.skeletonLine, styles.valueLine, { opacity }]} />
        </View>

        <View style={styles.infoRow}>
          <Animated.View style={[styles.skeletonLine, styles.labelLine, { opacity }]} />
          <Animated.View style={[styles.skeletonLine, styles.valueLine, { opacity }]} />
        </View>
      </View>

      <View style={styles.cardFooter}>
        <View style={styles.footerLeft}>
          <Animated.View style={[styles.dateContainer, { opacity }]} />
        </View>
      </View>
    </View>
  );
}
