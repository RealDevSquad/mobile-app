import { theme } from '@/constants/theme';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface ManageActionCardProps {
  icon: string;
  title: string;
  description: string;
  onPress: () => void;
}

const ManageActionCard: React.FC<ManageActionCardProps> = ({
  icon,
  title,
  description,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.cardContent}>
        <View style={styles.iconContainer}>
          <FontAwesome
            name={icon as any}
            size={24}
            color={theme.colors.primary[500]}
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
        <FontAwesome
          name="chevron-right"
          size={16}
          color={theme.colors.text.tertiary}
        />
      </View>
    </TouchableOpacity>
  );
};

export default function ManageScreen() {
  const router = useRouter();

  const handleExtensionRequestsPress = () => {
    router.push('/extension-requests');
  };

  const handleTaskRequestsPress = () => {
    router.push('/task-requests');
  };

  const handleCreateNewTaskPress = () => {
    router.push('/create-task');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Manage</Text>
            <Text style={styles.headerSubtitle}>
              Manage tasks, requests, and extensions
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <ManageActionCard
          icon="file-text-o"
          title="Extension Requests"
          description="Review and manage extension requests for tasks"
          onPress={handleExtensionRequestsPress}
        />

        <ManageActionCard
          icon="tasks"
          title="See what task people are up to"
          description="View and track task requests from team members"
          onPress={handleTaskRequestsPress}
        />

        <ManageActionCard
          icon="plus-circle"
          title="Create New Task"
          description="Request a new task from a GitHub issue"
          onPress={handleCreateNewTaskPress}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface.secondary,
  },
  header: {
    backgroundColor: theme.colors.background.primary,
    paddingTop: 24,
    paddingBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    borderBottomWidth: 1,
    textAlign: 'center',
    borderBottomColor: theme.colors.border.primary,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: theme.typography.fontSize['2xl'],
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.md,
  },
  card: {
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.md,
    ...theme.shadow.md,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  textContainer: {
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  title: {
    fontSize: theme.typography.fontSize.base,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  description: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text.secondary,
    lineHeight: theme.typography.fontSize.base * 1.4,
  },
});
