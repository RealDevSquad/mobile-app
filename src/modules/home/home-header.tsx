import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useRouter } from "expo-router";
import { Image, Platform, Pressable, Text, View } from "react-native";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { getInitials } from "../../utils/common.utils";
import styles from "./home.styles";

export function HomeHeader() {
  const router = useRouter();
  const { data: user } = useCurrentUser();

  const isAndroid = Platform.OS === "android";
  const displayName = user?.first_name || user?.username || "User";
  const capitalizedName = displayName.charAt(0).toUpperCase() + displayName.slice(1).toLowerCase();

  const initials = getInitials(user?.first_name, user?.last_name, user?.username);

  const handleSettingsPress = () => {
    router.push("/(tabs)/settings");
  };

  return (
    <View style={[styles.header, { paddingTop: isAndroid ? 20 : 0 }]}>
      <View style={styles.headerLeft}>
        <Text style={styles.username}>{`Welcome ${capitalizedName}`}</Text>
      </View>

      <View style={styles.headerRight}>
        <Pressable style={styles.settingsButton} onPress={handleSettingsPress}>
          <FontAwesome5 name="cog" size={20} color="#1F2937" />
        </Pressable>

        <View style={styles.profileImageContainer}>
          {user?.picture?.url ? (
            <Image source={{ uri: user.picture.url }} style={styles.profileImage} />
          ) : (
            <View style={styles.profileImagePlaceholder}>
              <Text style={styles.profileImagePlaceholderText}>{initials}</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
