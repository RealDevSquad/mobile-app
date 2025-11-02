import { TaskRequestsApi } from '@/api/task-requests/task-requests.api';
import { TasksApi } from '@/api/tasks/tasks.api';
import { TTaskRequestFormData } from '@/api/tasks/tasks.schema';
import { TGithubIssue } from '@/api/tasks/tasks.types';
import { UsersApi } from '@/api/users/users.api';
import { CreateTaskInput } from '@/modules/create-task/CreateTaskInput';
import { CreateTaskPreview } from '@/modules/create-task/CreateTaskPreview';
import TaskRequestModal from '@/modules/create-task/TaskRequestModal';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert } from 'react-native';

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
    onSuccess: () => {
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

  const renderContent = () => {
    if (pageState === 'input') {
      return (
        <CreateTaskInput
          githubUrl={githubUrl}
          onUrlChange={setGithubUrl}
          onSubmit={handleSubmitUrl}
          isLoadingIssue={isLoadingIssue}
          isLoadingUser={isLoadingUser}
        />
      );
    }

    if (selectedIssue) {
      return (
        <CreateTaskPreview
          issue={selectedIssue}
          onChangeUrl={handleChangeUrl}
          onCreateTask={handleRequestAsTask}
        />
      );
    }

    return null;
  };

  return (
    <>
      {renderContent()}

      <TaskRequestModal
        isVisible={isModalVisible}
        onSubmit={handleModalSubmit}
        onClose={handleModalClose}
        isLoading={createTaskRequestMutation.isPending}
      />
    </>
  );
}
