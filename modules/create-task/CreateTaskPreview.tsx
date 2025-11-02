import { TGithubIssue } from '@/api/tasks/tasks.types';
import GitHubRDSLogo from '@/components/GitHubRDSLogo';
import FormSubmitButton from '@/components/form/FormSubmitButton';
import { theme } from '@/constants/theme';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { IssuePreviewCard } from './IssuePreviewCard';

type CreateTaskPreviewProps = {
  issue: TGithubIssue;
  onChangeUrl: () => void;
  onCreateTask: () => void;
};

export const CreateTaskPreview: React.FC<CreateTaskPreviewProps> = ({
  issue,
  onChangeUrl,
  onCreateTask,
}) => {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <GitHubRDSLogo size={60} />
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Issue Preview</Text>
          <TouchableOpacity
            onPress={onChangeUrl}
            style={styles.changeUrlButton}
          >
            <Text style={styles.changeUrlText}>Change URL</Text>
          </TouchableOpacity>
        </View>
      </View>

      <IssuePreviewCard issue={issue} />

      <View style={styles.actionContainer}>
        <FormSubmitButton
          text="Create Task"
          onPress={onCreateTask}
          isLoading={false}
          isDisabled={false}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface.secondary,
    padding: theme.spacing.md,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.xl,
  },
  titleContainer: {
    alignItems: 'center',
    marginTop: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.fontSize.xl,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  changeUrlButton: {
    alignSelf: 'flex-start',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
  },
  changeUrlText: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.primary[600],
  },
  actionContainer: {
    marginTop: theme.spacing.lg,
  },
});
