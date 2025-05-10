import { removeLocalStorageItem } from "@/common/utils/common";
import Avatar from "@/components/Avatar";
import SocialLinks from "@/components/SocialLinks";
import UserDetails from "@/components/UserDetails";
import { TOKEN_KEY } from "@/constants/constants";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { reloadAppAsync } from "expo";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const Header: React.FC<any> = (props) => {
  const [menuVisible, setMenuVisible] = useState(false);

  const handleLogout = async () => {
    try {
      await removeLocalStorageItem(TOKEN_KEY);
      router.navigate("/");
      reloadAppAsync();
    } catch (error) {
      console.error("Error logging out", error);
    }
  };

  const toggleMenu = () => setMenuVisible(!menuVisible);

  const closeMenu = () => {
    if (menuVisible) {
      setMenuVisible(false);
    }
  };

  return (
    <TouchableWithoutFeedback
      testID="menu-backdrop"
      onPress={closeMenu}
      accessibilityRole="button"
    >
      <View
        style={[
          styles.container,
          Platform.OS === "ios" && { marginTop: 80 }, // Add marginTop for iOS
        ]}
      >
        <TouchableOpacity
          style={styles.menuButton}
          onPress={toggleMenu}
          accessibilityRole="button"
          testID="menu-button"
        >
          <FontAwesome name="ellipsis-v" size={24} color="#000" />
        </TouchableOpacity>
        {menuVisible && (
          <View style={styles.menu}>
            <TouchableOpacity onPress={handleLogout} accessibilityRole="button">
              <Text style={styles.menuItem}>Logout</Text>
            </TouchableOpacity>
            {/* Add more menu items here */}
          </View>
        )}
        {props.picture?.url && <Avatar uri={props.picture.url} size={100} />}
        <UserDetails
          name={`${props.first_name} ${props.last_name}`}
          username={props.username}
          designation={props.designation}
          company={props.company}
        />
        <SocialLinks
          github_id={props.github_id}
          twitter_id={props.twitter_id}
          linkedin_id={props.linkedin_id}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    marginTop: 50,
  },
  menuButton: {
    position: "absolute",
    top: -20,
    right: 20,
  },
  menu: {
    position: "absolute",
    top: 10,
    right: 20,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  menuItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    color: "#000",
  },
});

export default Header;
