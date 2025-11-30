import React, { useEffect, useRef } from "react";
import { Animated, Pressable, Text, View, LayoutChangeEvent, StyleSheet } from "react-native";

export type TabItem<T extends string> = {
  key: T;
  label: string;
};

type AnimatedTabsProps<T extends string> = {
  tabs: TabItem<T>[];
  activeTab: T;
  onTabChange: (tab: T) => void;
  activeColor?: string;
  inactiveColor?: string;
};

export function AnimatedTabs<T extends string>({
  tabs,
  activeTab,
  onTabChange,
  activeColor = "#E30464",
  inactiveColor = "#6B7280",
}: AnimatedTabsProps<T>) {
  const translateX = useRef(new Animated.Value(0)).current;
  const tabWidths = useRef<number[]>([]);
  const tabPositions = useRef<number[]>([]);
  const containerWidth = useRef(0);

  const activeIndex = tabs.findIndex((tab) => tab.key === activeTab);

  useEffect(() => {
    if (tabPositions.current.length === tabs.length && tabWidths.current.length === tabs.length) {
      const targetPosition = tabPositions.current[activeIndex] || 0;

      Animated.spring(translateX, {
        toValue: targetPosition,
        useNativeDriver: true,
        tension: 68,
        friction: 12,
      }).start();
    }
  }, [activeIndex, translateX, tabs.length]);

  const handleTabLayout = (index: number, event: LayoutChangeEvent) => {
    const { x, width } = event.nativeEvent.layout;
    tabWidths.current[index] = width;
    tabPositions.current[index] = x;

    // If all tabs have been measured, animate to the current position
    if (tabWidths.current.filter(Boolean).length === tabs.length) {
      translateX.setValue(tabPositions.current[activeIndex] || 0);
    }
  };

  const handleContainerLayout = (event: LayoutChangeEvent) => {
    containerWidth.current = event.nativeEvent.layout.width;
  };

  const indicatorWidth = tabWidths.current[activeIndex] || containerWidth.current / tabs.length;

  return (
    <View style={styles.tabsContainer} onLayout={handleContainerLayout}>
      {tabs.map((tab, index) => (
        <Pressable
          key={tab.key}
          style={styles.tab}
          onPress={() => onTabChange(tab.key)}
          onLayout={(event) => handleTabLayout(index, event)}
        >
          <Text
            style={[
              styles.tabText,
              { color: activeTab === tab.key ? activeColor : inactiveColor },
            ]}
          >
            {tab.label}
          </Text>
        </Pressable>
      ))}
      <Animated.View
        style={[
          styles.activeIndicator,
          {
            backgroundColor: activeColor,
            width: indicatorWidth,
            transform: [{ translateX }],
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F5F3FF",
    paddingHorizontal: 20,
    position: "relative",
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "600",
  },
  activeIndicator: {
    position: "absolute",
    bottom: 0,
    left: 20,
    height: 3,
    borderRadius: 2,
  },
});

