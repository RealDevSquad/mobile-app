import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, Platform, Pressable, Text, TextInput, View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { ExtensionRequestsApi } from "../../../api/extension-requests/extension-requests.api";
import {
  extensionRequestFormSchema,
  TExtensionRequestFormFormData,
} from "../../../api/extension-requests/extension-requests.schema";
import { TaskDetailsDTO } from "../../../api/tasks/task.dto";
import { useCurrentUser } from "../../../hooks/useCurrentUser";
import { formatDateFromDateObject } from "../../../utils/common.utils";
import { Sheet, ActionButton } from "../../../components/Sheet";
import styles from "./extension-request-modal.styles";

type ExtensionRequestModalProps = {
  visible: boolean;
  onClose: () => void;
  taskId: string;
  task: TaskDetailsDTO["taskData"];
};

export function ExtensionRequestModal({
  visible,
  onClose,
  taskId,
  task,
}: ExtensionRequestModalProps) {
  const queryClient = useQueryClient();
  const { data: currentUser } = useCurrentUser();
  const [showDatePicker, setShowDatePicker] = useState(false);

  const oldEndsOn = task.endsOn ? new Date(task.endsOn * 1000) : null;
  const minimumDate = oldEndsOn || new Date();

  const getDefaultNewEndsOn = () => {
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 7);
    return defaultDate;
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TExtensionRequestFormFormData>({
    resolver: zodResolver(extensionRequestFormSchema as any),
    defaultValues: {
      title: task.title,
      reason: "",
      newEndsOn: getDefaultNewEndsOn(),
    },
  });

  const mutation = useMutation({
    mutationFn: ExtensionRequestsApi.createExtensionRequest.fn,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ExtensionRequestsApi.getSelfExtensionRequests.key({ taskId }),
      });
      queryClient.invalidateQueries({
        queryKey: ["ExtensionRequestsApi.getExtensionRequests"],
      });
      Alert.alert("Success", "Extension request created successfully");
      reset();
      onClose();
    },
    onError: (error: any) => {
      Alert.alert("Error", error?.response?.data?.message || "Failed to create extension request");
    },
  });

  const onSubmit = (data: TExtensionRequestFormFormData) => {
    if (!currentUser?.username) {
      Alert.alert("Error", "User information not available");
      return;
    }

    if (oldEndsOn && data.newEndsOn <= oldEndsOn) {
      Alert.alert("Validation Error", "New deadline must be after the current deadline");
      return;
    }
    if (data.newEndsOn < new Date()) {
      Alert.alert("Validation Error", "New deadline cannot be in the past");
      return;
    }

    const newEndsOnTimestamp = Math.floor(data.newEndsOn.getTime() / 1000);
    const oldEndsOnTimestamp = task.endsOn || Math.floor(Date.now() / 1000);

    mutation.mutate({
      taskId,
      assignee: currentUser.username,
      title: data.title.trim(),
      reason: data.reason.trim(),
      newEndsOn: newEndsOnTimestamp,
      oldEndsOn: oldEndsOnTimestamp,
      status: "PENDING",
    });
  };

  const handleDateChange = (onChange: (date: Date) => void, event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      onChange(selectedDate);
    }
  };

  const actionButtons: ActionButton[] = [
    {
      label: "Cancel",
      onPress: () => {
        reset();
        onClose();
      },
      variant: "secondary",
      disabled: mutation.isPending,
    },
    {
      label: "Submit",
      onPress: () => {
        handleSubmit(onSubmit)();
      },
      variant: "primary",
      disabled: mutation.isPending,
      loading: mutation.isPending,
    },
  ];

  return (
    <Sheet
      visible={visible}
      onClose={onClose}
      heading="Raise Extension Request"
      icon={<FontAwesome5 name="calendar-plus" size={20} color="#E30464" />}
      actionButtons={actionButtons}
    >
      <View style={styles.formGroup}>
        <Text style={styles.label}>Title</Text>
        <Controller
          control={control}
          name="title"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[styles.input, errors.title && styles.inputError]}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Enter title"
              placeholderTextColor="#9CA3AF"
            />
          )}
        />
        {errors.title && <Text style={styles.errorText}>{errors.title.message}</Text>}
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Reason</Text>
        <Controller
          control={control}
          name="reason"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[styles.input, styles.textArea, errors.reason && styles.inputError]}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Enter reason for extension"
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          )}
        />
        {errors.reason && <Text style={styles.errorText}>{errors.reason.message}</Text>}
      </View>

      {oldEndsOn && (
        <View style={styles.formGroup}>
          <Text style={styles.label}>Current End Date</Text>
          <View style={styles.displayValue}>
            <Text style={styles.displayValueText}>{formatDateFromDateObject(oldEndsOn)}</Text>
          </View>
        </View>
      )}

      <View style={styles.formGroup}>
        <Text style={styles.label}>New End Date</Text>
        <Controller
          control={control}
          name="newEndsOn"
          render={({ field: { onChange, value } }) => (
            <>
              <Pressable
                style={[styles.datePickerButton, errors.newEndsOn && styles.inputError]}
                onPress={() => setShowDatePicker(true)}
              >
                <FontAwesome5 name="calendar-alt" size={16} color="#6B7280" />
                <Text style={styles.datePickerText}>{formatDateFromDateObject(value)}</Text>
              </Pressable>
              {showDatePicker && (
                <DateTimePicker
                  value={value}
                  mode="datetime"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={(event, selectedDate) =>
                    handleDateChange(onChange, event, selectedDate)
                  }
                  minimumDate={minimumDate}
                />
              )}
            </>
          )}
        />
        {errors.newEndsOn && <Text style={styles.errorText}>{errors.newEndsOn.message}</Text>}
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Assignee</Text>
        <View style={styles.displayValue}>
          <Text style={styles.displayValueText}>{task.assignee || "Unassigned"}</Text>
        </View>
      </View>
    </Sheet>
  );
}
