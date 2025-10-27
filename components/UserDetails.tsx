import { theme } from '@/constants/theme';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface UserDetailsProps {
  name: string;
  username: string;
  designation: string;
  company: string;
}

const UserDetails = ({
  name,
  username,
  designation,
  company,
}: UserDetailsProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.name}>{name}</Text>
      {!!username && <Text style={styles.username}>{'@' + username}</Text>}
      {!!designation && <Text style={styles.designation}>{designation}</Text>}
      {!!company && <Text style={styles.company}>{company}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: theme.spacing.sm,
  },
  name: {
    fontSize: theme.typography.fontSize.xl,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
  username: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.regular,
    textAlign: 'center',
    color: theme.colors.text.secondary,
  },
  designation: {
    fontSize: theme.typography.fontSize.base,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
  company: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
});

export default UserDetails;
