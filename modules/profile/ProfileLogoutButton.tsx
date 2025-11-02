import { theme } from '@/constants/theme';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

type ProfileLogoutButtonProps = {
  onPress: () => void;
};

export const ProfileLogoutButton: React.FC<ProfileLogoutButtonProps> = ({
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.logoutButton}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Logout"
      testID="logout-button"
    >
      <Text style={styles.logoutButtonText}>Logout</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  logoutButton: {
    width: '100%',
    backgroundColor: theme.colors.error[600],
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadow.md,
  },
  logoutButtonText: {
    color: theme.colors.text.inverted,
    fontSize: theme.typography.fontSize.base,
    fontFamily: theme.typography.fontFamily.bold,
  },
});
