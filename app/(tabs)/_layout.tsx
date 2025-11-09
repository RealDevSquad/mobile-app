import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuthStore } from "../../src/store/authStore";

type TabBarIconProps = {
  color: string;
  focused: boolean;
};

function HomeIcon({ color, focused }: TabBarIconProps) {
  return <FontAwesome5 name="home" solid={focused} color={color} size={24} />;
}

function TasksIcon({ color, focused }: TabBarIconProps) {
  return <FontAwesome5 name="tasks" solid={focused} color={color} size={24} />;
}

function ExploreIcon({ color, focused }: TabBarIconProps) {
  return <FontAwesome5 name="compass" solid={focused} color={color} size={24} />;
}

function ProfileIcon({ color, focused }: TabBarIconProps) {
  return <FontAwesome5 name="user" solid={focused} color={color} size={24} />;
}

function AboutIcon({ color, focused }: TabBarIconProps) {
  return <FontAwesome5 name="info-circle" solid={focused} color={color} size={24} />;
}

function DashboardIcon({ color, focused }: TabBarIconProps) {
  return <FontAwesome5 name="th-large" solid={focused} color={color} size={24} />;
}

export default function TabLayout() {
  const { isAuthenticated } = useAuthStore();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#E30464",
        headerStyle: {
          backgroundColor: "#ffffff",
          paddingTop: insets.top,
        },
        headerShadowVisible: false,
        headerTintColor: "ffffff",
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopWidth: 0,
          display: isAuthenticated ? "flex" : "none",
          paddingBottom: insets.bottom,
          height: 60 + insets.bottom,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: HomeIcon,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          title: "Tasks",
          tabBarIcon: TasksIcon,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ExploreIcon,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ProfileIcon,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          tabBarIcon: DashboardIcon,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: "About",
          tabBarIcon: AboutIcon,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="task-requests"
        options={{
          href: null,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="extension-requests"
        options={{
          href: null,
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
