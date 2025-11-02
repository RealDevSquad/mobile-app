import { theme } from '@/constants/theme';
import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type InfoCardProps = {
  title: string;
  description: string;
  url: string;
  cardWidth: number;
};

const InfoCard: React.FC<InfoCardProps> = ({
  title,
  description,
  url,
  cardWidth,
}) => {
  const handlePress = () => {
    WebBrowser.openBrowserAsync(url);
  };

  return (
    <TouchableOpacity
      style={[styles.container, { width: cardWidth }]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View>
          <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
            {title}
          </Text>
        </View>
        <Text style={styles.description} numberOfLines={4} ellipsizeMode="tail">
          {description}
        </Text>
        <View style={styles.viewMoreContainer}>
          <Text style={styles.viewMoreText}>View more →</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: theme.radius.md,
    padding: theme.spacing.lg,
    ...theme.shadow.md,
    height: 160,
    backgroundColor: theme.colors.gray[900],
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    width: '100%',
  },
  title: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.inverted,
    marginBottom: theme.spacing.md,
    textDecorationLine: 'underline',
    textDecorationColor: theme.colors.text.inverted,
    lineHeight: theme.typography.fontSize.lg,
    width: '100%',
  },
  description: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text.inverted,
    lineHeight:
      theme.typography.fontSize.sm * theme.typography.lineHeight.normal,
    flex: 1,
    width: '100%',
    marginBottom: theme.spacing.sm,
  },
  viewMoreContainer: {
    alignItems: 'flex-end',
    width: '100%',
    flexShrink: 0,
  },
  viewMoreText: {
    fontSize: theme.typography.fontSize.xs,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.primary[200],
  },
});

export default InfoCard;
