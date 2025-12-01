import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { TabView, TabBar, Route } from "react-native-tab-view";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

type Tab<T extends string> = {
  key: T;
  label: string;
};

type SwipeableTabsProps<T extends string> = {
  tabs: Tab<T>[];
  activeTab: T;
  onTabChange: (tab: T) => void;
  children: React.ReactNode[];
};

export function SwipeableTabs<T extends string>({
  tabs,
  activeTab,
  onTabChange,
  children,
}: SwipeableTabsProps<T>) {
  const routes = tabs.map((tab) => ({ key: tab.key, title: tab.label }));
  const activeIndex = tabs.findIndex((tab) => tab.key === activeTab);

  const renderScene = ({ route }: { route: Route }) => {
    const index = tabs.findIndex((tab) => tab.key === route.key);
    return <View style={styles.sceneContainer}>{children[index]}</View>;
  };

  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      indicatorStyle={styles.indicator}
      style={styles.tabBar}
      labelStyle={styles.label}
      activeColor="#E30464"
      inactiveColor="#6B7280"
      pressColor="rgba(227, 4, 100, 0.1)"
    />
  );

  return (
    <TabView
      navigationState={{ index: activeIndex, routes }}
      renderScene={renderScene}
      renderTabBar={renderTabBar}
      onIndexChange={(index) => onTabChange(tabs[index].key)}
      initialLayout={{ width: SCREEN_WIDTH }}
      style={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    backgroundColor: "#FFFFFF",
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F3FF",
  },
  indicator: {
    backgroundColor: "#E30464",
    height: 3,
    borderRadius: 2,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    textTransform: "none",
  },
  sceneContainer: {
    flex: 1,
  },
});
