import { theme } from '@/constants/theme';
import React from 'react';
import { Linking, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { TaskRequestDetailsSection } from './TaskRequestDetailsSection';

type TaskRequestExternalLinksProps = {
  externalIssueUrl?: string;
  externalIssueHtmlUrl?: string;
};

export const TaskRequestExternalLinks: React.FC<
  TaskRequestExternalLinksProps
> = ({ externalIssueUrl, externalIssueHtmlUrl }) => {
  if (!externalIssueUrl) {
    return null;
  }

  const handleExternalLink = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <TaskRequestDetailsSection title="External Links">
      <TouchableOpacity
        style={styles.linkButton}
        onPress={() => handleExternalLink(externalIssueUrl)}
      >
        <Text style={styles.linkText}>View GitHub Issue</Text>
      </TouchableOpacity>
      {externalIssueHtmlUrl && (
        <TouchableOpacity
          style={styles.linkButton}
          onPress={() => handleExternalLink(externalIssueHtmlUrl)}
        >
          <Text style={styles.linkText}>View on GitHub</Text>
        </TouchableOpacity>
      )}
    </TaskRequestDetailsSection>
  );
};

const styles = StyleSheet.create({
  linkButton: {
    backgroundColor: theme.colors.primary[600],
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs + 12,
    borderRadius: theme.radius.sm,
    marginBottom: theme.spacing.sm,
  },
  linkText: {
    color: theme.colors.text.inverted,
    fontSize: theme.typography.fontSize.xs,
    fontFamily: theme.typography.fontFamily.bold,
    textAlign: 'center',
  },
});
