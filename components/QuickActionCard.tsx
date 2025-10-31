import { theme } from '@/constants/theme';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface QuickActionCardProps {
  icon: string;
  label: string;
  onPress: () => void;
}

const QuickActionCard: React.FC<QuickActionCardProps> = ({
  icon,
  label,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.iconContainer}>
        <FontAwesome
          name={icon as any}
          size={24}
          color={theme.colors.primary[700]}
        />
      </View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadow.md,
    minHeight: 90,
  },
  iconContainer: {
    marginBottom: theme.spacing.sm,
  },
  label: {
    fontSize: theme.typography.fontSize.xs,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
});

export default QuickActionCard;
