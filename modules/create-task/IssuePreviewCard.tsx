import { TGithubIssue } from '@/api/tasks/tasks.types';
import Avatar from '@/components/Avatar';
import { theme } from '@/constants/theme';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type IssuePreviewCardProps = {
  issue: TGithubIssue;
};

export const IssuePreviewCard: React.FC<IssuePreviewCardProps> = ({
  issue,
}) => {
  return (
    <View style={styles.issueCard}>
      <Text style={styles.issueTitle}>{issue.title}</Text>

      <View style={styles.issueMeta}>
        <View style={styles.assigneeContainer}>
          <Text style={styles.metaLabel}>Assignee:</Text>
          {issue.assignee ? (
            <View style={styles.assigneeInfo}>
              <Avatar uri={issue.assignee.avatar_url} size={24} />
              <Text style={styles.assigneeName}>{issue.assignee.login}</Text>
            </View>
          ) : (
            <Text style={styles.noAssignee}>No assignee</Text>
          )}
        </View>

        <View style={styles.labelsContainer}>
          <Text style={styles.metaLabel}>Labels:</Text>
          <View style={styles.labelsList}>
            {issue.labels.map((label) => (
              <View
                key={label.id}
                style={[
                  styles.labelChip,
                  { backgroundColor: `#${label.color}` },
                ]}
              >
                <Text style={styles.labelText}>{label.name}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.bodyContainer}>
        <Text style={styles.bodyLabel}>Description:</Text>
        <Text style={styles.bodyText} numberOfLines={6}>
          {issue.body || 'No description available'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  issueCard: {
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    ...theme.shadow.md,
  },
  issueTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  issueMeta: {
    marginBottom: theme.spacing.md,
  },
  assigneeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  metaLabel: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text.secondary,
    marginRight: theme.spacing.sm,
    minWidth: 80,
  },
  assigneeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  assigneeName: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.sm,
  },
  noAssignee: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text.tertiary,
    fontStyle: 'italic',
  },
  labelsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  labelsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
  },
  labelChip: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.sm,
    marginRight: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
  },
  labelText: {
    fontSize: theme.typography.fontSize.xs,
    fontFamily: theme.typography.fontFamily.medium,
    color: '#FFFFFF',
  },
  bodyContainer: {
    marginTop: theme.spacing.sm,
  },
  bodyLabel: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  bodyText: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text.primary,
    lineHeight: 20,
  },
});
