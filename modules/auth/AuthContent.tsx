import { theme } from '@/constants/theme';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type AuthContentProps = {
  onGitHubLogin: () => void;
  onWebLogin: () => void;
};

export const AuthContent: React.FC<AuthContentProps> = ({
  onGitHubLogin,
  onWebLogin,
}) => {
  return (
    <View style={styles.content}>
      <Image
        source={require('../../assets/images/rdsLogo.png')}
        style={styles.logo}
        contentFit="contain"
        placeholder="blurhash"
      />
      <Text style={styles.title}>Welcome to</Text>
      <Text style={styles.title1}>REAL DEV SQUAD</Text>
      <Text style={styles.subtitle}>
        Community of developers, designers, PMs, and others who collaborate to
        build Real software
      </Text>

      <TouchableOpacity
        style={[styles.button, styles.githubButton]}
        onPress={onGitHubLogin}
      >
        <FontAwesome name="github" size={24} color="#fff" />
        <Text style={styles.buttonText}>GitHub Login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.webButton]}
        onPress={onWebLogin}
      >
        <FontAwesome name="qrcode" size={24} color="#fff" />
        <Text style={styles.buttonText}>Web Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: theme.spacing.sm,
  },
  title: {
    fontSize: theme.typography.fontSize['xl'],
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  title1: {
    fontSize: theme.typography.fontSize['2xl'],
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.base,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text.secondary || theme.colors.text.primary,
    textAlign: 'center',
    marginBottom: 160,
    paddingHorizontal: theme.spacing.lg,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.radius.sm,
    marginBottom: theme.spacing.md,
    width: 280,
    ...theme.shadow.lg,
  },
  githubButton: {
    backgroundColor: theme.colors.gray[800],
  },
  webButton: {
    backgroundColor: theme.colors.primary[500],
  },
  buttonText: {
    color: theme.colors.text.inverted,
    fontSize: theme.typography.fontSize.lg,
    fontFamily: theme.typography.fontFamily.medium,
    marginLeft: theme.spacing.sm,
  },
});
