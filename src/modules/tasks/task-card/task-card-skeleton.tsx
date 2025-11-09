import React, { useEffect, useRef } from "react";
import { Animated, View } from "react-native";
import styles from "./task-card-skeleton.styles";

export function TaskCardSkeleton() {
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
          <View style={styles.assigneeContainer}>
            <Animated.View style={[styles.assigneeAvatar, { opacity }]} />
            <Animated.View style={[styles.skeletonLine, styles.assigneeLine, { opacity }]} />
          </View>
        </View>

        <View style={styles.infoRow}>
          <Animated.View style={[styles.skeletonLine, styles.labelLine, { opacity }]} />
          <Animated.View style={[styles.skeletonLine, styles.valueLine, { opacity }]} />
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Animated.View style={[styles.skeletonLine, styles.progressLabelLine, { opacity }]} />
            <Animated.View
              style={[styles.skeletonLine, styles.progressPercentageLine, { opacity }]}
            />
          </View>
          <Animated.View style={[styles.progressBar, { opacity }]}>
            <Animated.View style={[styles.progressFill, { opacity }]} />
          </Animated.View>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <View style={styles.footerLeft}>
          <Animated.View style={[styles.priorityBadge, { opacity }]} />
          <Animated.View style={[styles.dueDateContainer, { opacity }]} />
        </View>
      </View>
    </View>
  );
}
