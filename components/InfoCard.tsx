import { theme } from '@/constants/theme';
import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type InfoCardProps = {
  title: string;
  description: string;
  url: string;
};

const InfoCard: React.FC<InfoCardProps> = ({ title, description, url }) => {
  const handlePress = () => {
    WebBrowser.openBrowserAsync(url);
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
        <View style={styles.viewMoreContainer}>
          <Text style={styles.viewMoreText}>View more →</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    ...theme.shadow.md,
    height: 160,
    marginHorizontal: theme.spacing.md,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  description: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text.secondary,
    lineHeight:
      theme.typography.fontSize.sm * theme.typography.lineHeight.normal,
    flex: 1,
  },
  viewMoreContainer: {
    alignItems: 'flex-end',
    marginTop: theme.spacing.sm,
  },
  viewMoreText: {
    fontSize: theme.typography.fontSize.xs,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.primary[600],
  },
});

export default InfoCard;
