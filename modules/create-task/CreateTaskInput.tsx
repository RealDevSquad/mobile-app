import FormInput from '@/components/form/FormInput';
import FormSubmitButton from '@/components/form/FormSubmitButton';
import GitHubRDSLogo from '@/components/GitHubRDSLogo';
import { theme } from '@/constants/theme';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type CreateTaskInputProps = {
  githubUrl: string;
  onUrlChange: (url: string) => void;
  onSubmit: () => void;
  isLoadingIssue: boolean;
  isLoadingUser: boolean;
};

export const CreateTaskInput: React.FC<CreateTaskInputProps> = ({
  githubUrl,
  onUrlChange,
  onSubmit,
  isLoadingIssue,
  isLoadingUser,
}) => {
  if (isLoadingUser) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: 'center', alignItems: 'center' },
        ]}
      >
        <Text style={styles.title}>Loading user data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <GitHubRDSLogo size={80} />
        <Text style={styles.title}>Create New Task</Text>
      </View>

      <View style={styles.form}>
        <FormInput
          label="GitHub Issue URL"
          placeholder="https://github.com/owner/repo/issues/123"
          value={githubUrl}
          onChangeText={onUrlChange}
          icon="link"
          required
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
        />

        <FormSubmitButton
          text="Fetch Issue Details"
          onPress={onSubmit}
          isLoading={isLoadingIssue}
          isDisabled={!githubUrl.trim() || isLoadingIssue}
        />
      </View>
    </View>
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
  title: {
    fontSize: theme.typography.fontSize.xl,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  form: {
    flex: 1,
  },
});
