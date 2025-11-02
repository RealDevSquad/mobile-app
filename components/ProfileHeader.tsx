import Avatar from '@/components/Avatar';
import { theme } from '@/constants/theme';
import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

interface ProfileHeaderProps {
  first_name?: string;
  last_name?: string;
  username?: string;
  designation?: string;
  picture?: { url: string };
}

const Header: React.FC<ProfileHeaderProps> = (props) => {
  const fullName = `${props.first_name || ''} ${props.last_name || ''}`.trim();

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        {props.picture?.url && (
          <View style={styles.avatarContainer}>
            <Avatar uri={props.picture.url} size={80} />
          </View>
        )}

        <View style={styles.userInfoContainer}>
          <Text style={styles.name} numberOfLines={1}>
            {fullName || 'User'}
          </Text>
          {props.username && (
            <Text style={styles.username}>@{props.username}</Text>
          )}
          {props.designation && (
            <Text style={styles.designation}>{props.designation}</Text>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: theme.colors.background.secondary,
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    paddingBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    marginTop: theme.spacing.xs,
  },
  avatarContainer: {
    marginBottom: -20, // Overlap with content below
  },
  userInfoContainer: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  name: {
    fontSize: theme.typography.fontSize.xl,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.primary,
  },
  username: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text.secondary,
  },
  designation: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
});

export default Header;
