import { removeLocalStorageItem } from '@/common/utils/common';
import Avatar from '@/components/Avatar';
import SocialLinks from '@/components/SocialLinks';
import UserDetails from '@/components/UserDetails';
import { TOKEN_KEY } from '@/constants/constants';
import { theme } from '@/constants/theme';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { reloadAppAsync } from 'expo';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

const Header: React.FC<any> = (props) => {
  const [menuVisible, setMenuVisible] = useState(false);

  const handleLogout = async () => {
    try {
      await removeLocalStorageItem(TOKEN_KEY);
      router.navigate('/');
      reloadAppAsync();
    } catch (error) {
      console.error('Error logging out', error);
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
          Platform.OS === 'ios' && { marginTop: 80 }, // Add marginTop for iOS
        ]}
      >
        <TouchableOpacity
          style={styles.menuButton}
          onPress={toggleMenu}
          accessibilityRole="button"
          testID="menu-button"
        >
          <FontAwesome
            name="ellipsis-v"
            size={24}
            color={theme.colors.text.primary}
          />
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
    alignItems: 'center',
    marginTop: 50,
  },
  menuButton: {
    position: 'absolute',
    top: -20,
    right: 20,
  },
  menu: {
    position: 'absolute',
    top: 10,
    right: 20,
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.radius.sm,
    padding: theme.spacing.sm,
    ...theme.shadow.md,
  },
  menuItem: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    fontSize: theme.typography.fontSize.base,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text.primary,
  },
});

export default Header;
