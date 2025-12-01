import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, Platform, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { TasksApi } from "../../api/tasks/tasks.api";
import { TGithubIssue } from "../../api/tasks/tasks.types";
import { TaskRequestsApi } from "../../api/task-requests/task-requests.api";
import {
  githubUrlSchema,
  taskRequestFormSchema,
  TGithubUrlFormData,
  TTaskRequestFormData,
} from "../../api/tasks/tasks.schema";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { formatDateFromDateObject } from "../../utils/common.utils";
import { Sheet, ActionButton } from "../../components/Sheet";
import styles from "./create-task-request-modal.styles";

type CreateTaskRequestModalProps = {
  visible: boolean;
  onClose: () => void;
};

export function CreateTaskRequestModal({ visible, onClose }: CreateTaskRequestModalProps) {
  const queryClient = useQueryClient();
  const { data: currentUser } = useCurrentUser();
  const [step, setStep] = useState<"url-input" | "form">("url-input");
  const [selectedIssue, setSelectedIssue] = useState<TGithubIssue | null>(null);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const urlForm = useForm<TGithubUrlFormData>({
    resolver: zodResolver(githubUrlSchema as any),
    defaultValues: {
      githubUrl: "",
    },
  });

  const githubUrlValue = urlForm.watch("githubUrl");

  const {
    isLoading: isLoadingIssue,
    error: githubIssueError,
    refetch: refetchIssue,
  } = useQuery({
    queryKey: TasksApi.getGithubIssue.key(githubUrlValue || ""),
    queryFn: () => TasksApi.getGithubIssue.fn(githubUrlValue || ""),
    enabled: false,
  });

  const taskRequestForm = useForm<TTaskRequestFormData>({
    resolver: zodResolver(taskRequestFormSchema as any),
    defaultValues: {
      proposedStartDate: new Date(),
      proposedDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      description: "",
    },
  });

  const createTaskRequestMutation = useMutation({
    mutationFn: TaskRequestsApi.createTaskRequest.fn,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["TaskRequestsApi.getTaskRequests"],
      });
      Alert.alert("Success", "Task request created successfully");
      handleClose();
    },
    onError: (error: any) => {
      Alert.alert("Error", error?.response?.data?.message || "Failed to create task request");
    },
  });

  const handleFetchIssue = async (data: TGithubUrlFormData) => {
    try {
      const result = await refetchIssue();
      if (result.data) {
        if (result.data.issues && result.data.issues.length > 0) {
          const issue = result.data.issues[0];
          setSelectedIssue(issue);
          setStep("form");
        } else {
          Alert.alert("Not Found", "No issue found for the provided URL");
        }
      } else if (result.error) {
        Alert.alert(
          "Error",
          result.error instanceof Error
            ? result.error.message
            : "Failed to fetch issue. Please check the URL and try again."
        );
      }
    } catch (error: any) {
      Alert.alert(
        "Error",
        error?.message || "Failed to fetch issue. Please check the URL and try again."
      );
    }
  };

  const handleBack = () => {
    setStep("url-input");
    setSelectedIssue(null);
    urlForm.reset();
    taskRequestForm.reset();
  };

  const handleClose = () => {
    setStep("url-input");
    setSelectedIssue(null);
    urlForm.reset();
    taskRequestForm.reset();
    onClose();
  };

  const onSubmitTaskRequest = (data: TTaskRequestFormData) => {
    if (!currentUser?.id) {
      Alert.alert("Error", "User information not available");
      return;
    }

    if (!selectedIssue) {
      Alert.alert("Error", "Issue information not available");
      return;
    }

    const proposedStartDate = data.proposedStartDate.getTime();
    const proposedDeadline = data.proposedDeadline.getTime();

    createTaskRequestMutation.mutate({
      externalIssueUrl: selectedIssue.url,
      externalIssueHtmlUrl: selectedIssue.html_url,
      userId: currentUser.id,
      requestType: "CREATION",
      proposedStartDate,
      proposedDeadline,
      description: data.description.trim(),
      markdownEnabled: true,
    });
  };

  const handleDateChange = (
    onChange: (date: Date) => void,
    event: any,
    isStartDate: boolean,
    selectedDate?: Date
  ) => {
    if (Platform.OS === "android") {
      if (isStartDate) {
        setShowStartDatePicker(false);
      } else {
        setShowEndDatePicker(false);
      }
    }
    if (selectedDate) {
      onChange(selectedDate);
    }
  };

  const getActionButtons = (): ActionButton[] => {
    if (step === "url-input") {
      return [
        {
          label: "Cancel",
          onPress: handleClose,
          variant: "secondary",
          disabled: isLoadingIssue,
        },
        {
          label: "Fetch Issue",
          onPress: () => {
            urlForm.handleSubmit(handleFetchIssue)();
          },
          variant: "primary",
          disabled: isLoadingIssue,
          loading: isLoadingIssue,
        },
      ];
    }

    return [
      {
        label: "Back",
        onPress: handleBack,
        variant: "secondary",
        disabled: createTaskRequestMutation.isPending,
      },
      {
        label: "Submit",
        onPress: () => {
          taskRequestForm.handleSubmit(onSubmitTaskRequest)();
        },
        variant: "primary",
        disabled: createTaskRequestMutation.isPending,
        loading: createTaskRequestMutation.isPending,
      },
    ];
  };

  const renderUrlInputStep = () => {
    return (
      <View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>GitHub Issue URL</Text>
          <Controller
            control={urlForm.control}
            name="githubUrl"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[
                  styles.input,
                  (urlForm.formState.errors.githubUrl || githubIssueError) && styles.inputError,
                ]}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="https://github.com/owner/repo/issues/123"
                placeholderTextColor="#9CA3AF"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoadingIssue}
              />
            )}
          />
          {urlForm.formState.errors.githubUrl && (
            <Text style={styles.errorText}>{urlForm.formState.errors.githubUrl.message}</Text>
          )}
          {githubIssueError && !urlForm.formState.errors.githubUrl && (
            <Text style={styles.errorText}>
              {githubIssueError instanceof Error
                ? githubIssueError.message
                : "Failed to fetch issue. Please check the URL and try again."}
            </Text>
          )}
        </View>

        <View style={styles.helpTextContainer}>
          <FontAwesome5 name="info-circle" size={14} color="#6B7280" />
          <Text style={styles.helpText}>
            Paste the GitHub issue URL to fetch issue details and pre-fill the form.
          </Text>
        </View>
      </View>
    );
  };

  const renderFormStep = () => {
    if (!selectedIssue) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Issue information not available</Text>
        </View>
      );
    }

    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.issueDetailsSection}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Title</Text>
            <View style={styles.displayValue}>
              <Text style={styles.displayValueText}>{selectedIssue.title}</Text>
            </View>
          </View>

          {selectedIssue.labels && selectedIssue.labels.length > 0 && (
            <View style={styles.formGroup}>
              <Text style={styles.label}>Labels</Text>
              <View style={styles.labelsContainer}>
                {selectedIssue.labels.map((label) => (
                  <View
                    key={label.id}
                    style={[styles.labelBadge, { backgroundColor: `#${label.color}20` }]}
                  >
                    <Text style={[styles.labelBadgeText, { color: `#${label.color}` }]}>
                      {label.name}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Start Date *</Text>
          <Controller
            control={taskRequestForm.control}
            name="proposedStartDate"
            render={({ field: { onChange, value } }) => (
              <>
                <Pressable
                  style={[
                    styles.datePickerButton,
                    taskRequestForm.formState.errors.proposedStartDate && styles.inputError,
                  ]}
                  onPress={() => setShowStartDatePicker(true)}
                >
                  <FontAwesome5 name="calendar-alt" size={16} color="#6B7280" />
                  <Text style={styles.datePickerText}>{formatDateFromDateObject(value)}</Text>
                </Pressable>
                {showStartDatePicker && (
                  <DateTimePicker
                    value={value}
                    mode="datetime"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={(event, selectedDate) =>
                      handleDateChange(onChange, event, true, selectedDate)
                    }
                    minimumDate={new Date()}
                  />
                )}
              </>
            )}
          />
          {taskRequestForm.formState.errors.proposedStartDate && (
            <Text style={styles.errorText}>
              {taskRequestForm.formState.errors.proposedStartDate.message}
            </Text>
          )}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>End Date *</Text>
          <Controller
            control={taskRequestForm.control}
            name="proposedDeadline"
            render={({ field: { onChange, value } }) => (
              <>
                <Pressable
                  style={[
                    styles.datePickerButton,
                    taskRequestForm.formState.errors.proposedDeadline && styles.inputError,
                  ]}
                  onPress={() => setShowEndDatePicker(true)}
                >
                  <FontAwesome5 name="calendar-alt" size={16} color="#6B7280" />
                  <Text style={styles.datePickerText}>{formatDateFromDateObject(value)}</Text>
                </Pressable>
                {showEndDatePicker && (
                  <DateTimePicker
                    value={value}
                    mode="datetime"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={(event, selectedDate) =>
                      handleDateChange(onChange, event, false, selectedDate)
                    }
                    minimumDate={new Date()}
                  />
                )}
              </>
            )}
          />
          {taskRequestForm.formState.errors.proposedDeadline && (
            <Text style={styles.errorText}>
              {taskRequestForm.formState.errors.proposedDeadline.message}
            </Text>
          )}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Description *</Text>
          <Controller
            control={taskRequestForm.control}
            name="description"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[
                  styles.input,
                  styles.textArea,
                  taskRequestForm.formState.errors.description && styles.inputError,
                ]}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Enter timeline overview and description"
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
            )}
          />
          {taskRequestForm.formState.errors.description && (
            <Text style={styles.errorText}>
              {taskRequestForm.formState.errors.description.message}
            </Text>
          )}
        </View>
      </ScrollView>
    );
  };

  return (
    <Sheet
      visible={visible}
      onClose={handleClose}
      heading={step === "url-input" ? "Create Task Request" : "Review & Submit Request"}
      icon={
        <FontAwesome5
          name={step === "url-input" ? "github" : "file-alt"}
          size={20}
          color="#E30464"
        />
      }
      actionButtons={getActionButtons()}
      height={step === "form" ? 72 : 50}
    >
      {step === "url-input" ? renderUrlInputStep() : renderFormStep()}
    </Sheet>
  );
}
