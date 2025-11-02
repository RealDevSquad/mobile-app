import { theme } from '@/constants/theme';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

type GitHubRDSLogoProps = {
  size?: number;
};

const GitHubRDSLogo: React.FC<GitHubRDSLogoProps> = ({ size = 120 }) => {
  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/rdsXGithub.webp')}
        style={[styles.logo, { width: size, height: size * 0.6 }]}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    borderRadius: theme.radius.sm,
  },
});

export default GitHubRDSLogo;
