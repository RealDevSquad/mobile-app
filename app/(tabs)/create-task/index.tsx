import { TaskRequestsApi } from '@/api/task-requests/task-requests.api';
import { TasksApi } from '@/api/tasks/tasks.api';
import { TTaskRequestFormData } from '@/api/tasks/tasks.schema';
import { TGithubIssue } from '@/api/tasks/tasks.types';
import { UsersApi } from '@/api/users/users.api';
import Avatar from '@/components/Avatar';
import GitHubRDSLogo from '@/components/GitHubRDSLogo';
import TaskRequestModal from '@/components/Modal/TaskRequestModal';
import FormInput from '@/components/form/FormInput';
import FormSubmitButton from '@/components/form/FormSubmitButton';
import { theme } from '@/constants/theme';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type PageState = 'input' | 'preview';

export default function CreateTaskScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [pageState, setPageState] = useState<PageState>('input');

  const [githubUrl, setGithubUrl] = useState('');
  const [selectedIssue, setSelectedIssue] = useState<TGithubIssue | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { data: currentUser, isLoading: isLoadingUser } = useQuery({
    queryKey: UsersApi.getUserDetails.key,
    queryFn: UsersApi.getUserDetails.fn,
  });

  const { isLoading: isLoadingIssue, refetch: fetchIssue } = useQuery({
    queryKey: TasksApi.getGithubIssue.key(githubUrl),
    queryFn: () => TasksApi.getGithubIssue.fn(githubUrl),
    enabled: false,
  });

  const createTaskRequestMutation = useMutation({
    mutationFn: (formData: TTaskRequestFormData) => {
      if (!selectedIssue) {
        throw new Error(
          'No GitHub issue selected. Please go back and select an issue.'
        );
      }

      if (!currentUser?.id) {
        throw new Error('User not found. Please log in again.');
      }

      const requestPayload = {
        externalIssueUrl: selectedIssue.url,
        externalIssueHtmlUrl: selectedIssue.html_url,
        userId: currentUser.id,
        requestType: 'CREATION' as const,
        proposedStartDate: formData.proposedStartDate.getTime(),
        proposedDeadline: formData.proposedDeadline.getTime(),
        description: formData.description,
        markdownEnabled: true,
      };

      return TaskRequestsApi.createTaskRequest.fn(requestPayload);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['TaskRequestsApi.getTaskRequests'],
      });
      setIsModalVisible(false);
      Alert.alert('Success', 'Task request created successfully!', [
        {
          text: 'OK',
          onPress: () => router.push('/home'),
        },
      ]);
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to create task request. Please try again.';
      Alert.alert('Error', errorMessage);
    },
  });

  const handleSubmitUrl = async () => {
    if (!githubUrl.trim()) {
      Alert.alert('Error', 'Please enter a GitHub issue URL');
      return;
    }

    const githubUrlPattern =
      /^https:\/\/github\.com\/[^/]+\/[^/]+\/issues\/\d+$/;
    if (!githubUrlPattern.test(githubUrl.trim())) {
      Alert.alert('Error', 'Please enter a valid GitHub issue URL');
      return;
    }

    try {
      const result = await fetchIssue();
      if (result.data?.issues && result.data.issues.length > 0) {
        setSelectedIssue(result.data.issues[0]);
        setPageState('preview');
      } else {
        Alert.alert('Error', 'No issue found for the provided URL');
      }
    } catch (error) {
      console.error('Error fetching issue:', error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to fetch issue details';
      Alert.alert('Error', errorMessage);
    }
  };

  const handleRequestAsTask = () => {
    if (!selectedIssue) {
      Alert.alert('Error', 'Please select a GitHub issue first');
      return;
    }

    if (!currentUser?.id) {
      Alert.alert('Error', 'User data not loaded. Please try again.');
      return;
    }

    setIsModalVisible(true);
  };

  const handleModalSubmit = (formData: TTaskRequestFormData) => {
    createTaskRequestMutation.mutate(formData);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const handleChangeUrl = () => {
    setPageState('input');
    setGithubUrl('');
    setSelectedIssue(null);
  };

  const renderInputState = () => (
    <View style={styles.container}>
      <View style={styles.header}>
        <GitHubRDSLogo size={80} />
        <Text style={styles.title}>Create New Task</Text>
      </View>

      {isLoadingUser ? (
        <View
          style={[
            styles.container,
            { justifyContent: 'center', alignItems: 'center' },
          ]}
        >
          <Text style={styles.title}>Loading user data...</Text>
        </View>
      ) : (
        <View style={styles.form}>
          <FormInput
            label="GitHub Issue URL"
            placeholder="https://github.com/owner/repo/issues/123"
            value={githubUrl}
            onChangeText={setGithubUrl}
            icon="link"
            required
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
          />

          <FormSubmitButton
            text="Fetch Issue Details"
            onPress={handleSubmitUrl}
            isLoading={isLoadingIssue}
            isDisabled={!githubUrl.trim() || isLoadingIssue}
          />
        </View>
      )}
    </View>
  );

  const renderPreviewState = () => {
    if (!selectedIssue) return null;

    return (
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <GitHubRDSLogo size={60} />
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Issue Preview</Text>
            <TouchableOpacity
              onPress={handleChangeUrl}
              style={styles.changeUrlButton}
            >
              <Text style={styles.changeUrlText}>Change URL</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.issueCard}>
          <Text style={styles.issueTitle}>{selectedIssue.title}</Text>

          <View style={styles.issueMeta}>
            <View style={styles.assigneeContainer}>
              <Text style={styles.metaLabel}>Assignee:</Text>
              {selectedIssue.assignee ? (
                <View style={styles.assigneeInfo}>
                  <Avatar uri={selectedIssue.assignee.avatar_url} size={24} />
                  <Text style={styles.assigneeName}>
                    {selectedIssue.assignee.login}
                  </Text>
                </View>
              ) : (
                <Text style={styles.noAssignee}>No assignee</Text>
              )}
            </View>

            <View style={styles.labelsContainer}>
              <Text style={styles.metaLabel}>Labels:</Text>
              <View style={styles.labelsList}>
                {selectedIssue.labels.map((label) => (
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
              {selectedIssue.body || 'No description available'}
            </Text>
          </View>
        </View>

        <View style={styles.actionContainer}>
          <FormSubmitButton
            text="Create Task"
            onPress={handleRequestAsTask}
            isLoading={false}
            isDisabled={false}
          />
        </View>
      </ScrollView>
    );
  };

  return (
    <>
      {pageState === 'input' ? renderInputState() : renderPreviewState()}

      <TaskRequestModal
        isVisible={isModalVisible}
        onSubmit={handleModalSubmit}
        onClose={handleModalClose}
        isLoading={createTaskRequestMutation.isPending}
      />
    </>
  );
}

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
  subtitle: {
    fontSize: theme.typography.fontSize.base,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text.secondary,
  },
  form: {
    flex: 1,
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
  actionContainer: {
    marginTop: theme.spacing.lg,
  },
});
