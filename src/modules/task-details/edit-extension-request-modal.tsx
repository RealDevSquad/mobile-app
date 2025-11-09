import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, Platform, Pressable, Text, TextInput, View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { ExtensionRequestsApi } from "../../api/extension-requests/extension-requests.api";
import { ExtensionRequestDTO } from "../../api/extension-requests/extension-request.dto";
import {
  updateExtensionRequestFormSchema,
  TUpdateExtensionRequestFormFormData,
} from "../../api/extension-requests/extension-requests.schema";
import { Sheet, ActionButton } from "../../components/Sheet";
import styles from "./extension-request-modal.styles";

type EditExtensionRequestModalProps = {
  visible: boolean;
  onClose: () => void;
  extensionRequest: ExtensionRequestDTO;
  taskId: string;
  onUpdateSuccess?: () => void;
};

export function EditExtensionRequestModal({
  visible,
  onClose,
  extensionRequest,
  taskId,
  onUpdateSuccess,
}: EditExtensionRequestModalProps) {
  const queryClient = useQueryClient();
  const [showDatePicker, setShowDatePicker] = useState(false);

  const oldEndsOn = new Date(extensionRequest.oldEndsOn * 1000);
  const minimumDate = oldEndsOn;

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TUpdateExtensionRequestFormFormData>({
    resolver: zodResolver(updateExtensionRequestFormSchema as any),
    defaultValues: {
      title: extensionRequest.title,
      reason: extensionRequest.reason,
      newEndsOn: new Date(extensionRequest.newEndsOn * 1000),
    },
  });

  const mutation = useMutation({
    mutationFn: (data: TUpdateExtensionRequestFormFormData) =>
      ExtensionRequestsApi.updateExtensionRequest.fn(extensionRequest.id, {
        title: data.title.trim(),
        reason: data.reason.trim(),
        newEndsOn: Math.floor(data.newEndsOn.getTime() / 1000),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ExtensionRequestsApi.getSelfExtensionRequests.key({ taskId }),
      });
      queryClient.invalidateQueries({
        queryKey: ["ExtensionRequestsApi.getExtensionRequests"],
      });
      reset();
      onClose();
      Alert.alert("Success", "Extension request updated successfully");
    },
    onError: (error: any) => {
      Alert.alert("Error", error?.response?.data?.message || "Failed to update extension request");
    },
  });

  const onSubmit = (data: TUpdateExtensionRequestFormFormData) => {
    if (oldEndsOn && data.newEndsOn <= oldEndsOn) {
      Alert.alert("Validation Error", "New deadline must be after the current deadline");
      return;
    }
    if (data.newEndsOn < new Date()) {
      Alert.alert("Validation Error", "New deadline cannot be in the past");
      return;
    }
    mutation.mutate(data);
  };

  const handleDateChange = (onChange: (date: Date) => void, event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      onChange(selectedDate);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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
      label: "Update",
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
      heading="Edit Extension Request"
      icon={<FontAwesome5 name="edit" size={20} color="#E30464" />}
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

      <View style={styles.formGroup}>
        <Text style={styles.label}>Current End Date</Text>
        <View style={styles.displayValue}>
          <Text style={styles.displayValueText}>{formatDate(oldEndsOn)}</Text>
        </View>
      </View>

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
                <Text style={styles.datePickerText}>{formatDate(value)}</Text>
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
    </Sheet>
  );
}
