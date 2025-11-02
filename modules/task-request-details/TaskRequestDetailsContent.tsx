import { formatDate, formatDateTime } from '@/common/utils/dateUtils';
import { theme } from '@/constants/theme';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { TaskRequestDetailsHeader } from './TaskRequestDetailsHeader';
import { TaskRequestDetailsRow } from './TaskRequestDetailsRow';
import { TaskRequestDetailsSection } from './TaskRequestDetailsSection';
import { TaskRequestExternalLinks } from './TaskRequestExternalLinks';

type TaskRequestDetailsContentProps = {
  taskRequest: any;
  primaryUserDetails?: any;
};

const formatDateFromTimestamp = (timestamp?: number) => {
  if (!timestamp || timestamp <= 0 || Number.isNaN(timestamp)) {
    return 'Not set';
  }
  const unixTimestamp =
    timestamp > 1000000000000 ? Math.floor(timestamp / 1000) : timestamp;
  return formatDate(unixTimestamp);
};

const formatDateTimeFromTimestamp = (timestamp?: number) => {
  if (!timestamp || timestamp <= 0 || Number.isNaN(timestamp)) {
    return 'Not set';
  }
  const unixTimestamp =
    timestamp > 1000000000000 ? Math.floor(timestamp / 1000) : timestamp;
  return formatDateTime(unixTimestamp);
};

export const TaskRequestDetailsContent: React.FC<
  TaskRequestDetailsContentProps
> = ({ taskRequest, primaryUserDetails }) => {
  return (
    <View style={styles.content}>
      <TaskRequestDetailsHeader
        title={taskRequest.taskTitle}
        status={taskRequest.status}
      />

      <TaskRequestDetailsSection title="Request Details">
        <TaskRequestDetailsRow
          label="Requested by:"
          value={primaryUserDetails?.user.username || 'Unknown'}
        />
        <TaskRequestDetailsRow
          label="Request Type:"
          value={taskRequest.requestType}
        />
        <TaskRequestDetailsRow
          label="Created:"
          value={formatDateTimeFromTimestamp(taskRequest.createdAt)}
        />
        <TaskRequestDetailsRow
          label="Last Modified:"
          value={formatDateTimeFromTimestamp(taskRequest.lastModifiedAt)}
        />
      </TaskRequestDetailsSection>

      {taskRequest.users[0]?.proposedStartDate &&
        taskRequest.users[0]?.proposedDeadline && (
          <TaskRequestDetailsSection title="Proposed Timeline">
            <TaskRequestDetailsRow
              label="Start Date:"
              value={formatDateFromTimestamp(
                taskRequest.users[0].proposedStartDate
              )}
            />
            <TaskRequestDetailsRow
              label="Deadline:"
              value={formatDateFromTimestamp(
                taskRequest.users[0].proposedDeadline
              )}
            />
          </TaskRequestDetailsSection>
        )}

      <TaskRequestExternalLinks
        externalIssueUrl={taskRequest.externalIssueUrl}
        externalIssueHtmlUrl={taskRequest.externalIssueHtmlUrl}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: theme.spacing.md,
  },
});
