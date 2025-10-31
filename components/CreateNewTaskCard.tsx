import { theme } from '@/constants/theme';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface CreateNewTaskCardProps {
  onPress: () => void;
}

const CreateNewTaskCard: React.FC<CreateNewTaskCardProps> = ({ onPress }) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.content}>
          <Text style={styles.description}>Create New Task</Text>
          <Text style={styles.subtitle}>
            Request a new task from GitHub issue
          </Text>
        </View>

        <FontAwesome
          name="plus-circle"
          size={16}
          color={theme.colors.text.secondary}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background.primary,
    marginHorizontal: theme.spacing.sm,
    marginBottom: theme.spacing.md,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    ...theme.shadow.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  description: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text.primary,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.xs,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text.secondary,
  },
});

export default CreateNewTaskCard;
