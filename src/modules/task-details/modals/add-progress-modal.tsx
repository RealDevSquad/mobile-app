import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, Text, TextInput, View } from "react-native";
import { TasksApi } from "../../../api/tasks/tasks.api";
import { addProgressFormSchema, TAddProgressFormFormData } from "../../../api/tasks/tasks.schema";
import { Sheet, ActionButton } from "../../../components/Sheet";
import styles from "./add-progress-modal.styles";

type AddProgressModalProps = {
  visible: boolean;
  onClose: () => void;
  taskId: string;
};

export function AddProgressModal({ visible, onClose, taskId }: AddProgressModalProps) {
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TAddProgressFormFormData>({
    resolver: zodResolver(addProgressFormSchema as any),
    defaultValues: {
      completed: "",
      planned: "",
      blockers: "",
    },
  });

  const addProgressMutation = useMutation({
    mutationFn: TasksApi.submitProgress.fn,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: TasksApi.getTaskProgress.key(taskId),
      });
      queryClient.invalidateQueries({
        queryKey: TasksApi.getTaskDetails.key(taskId),
      });
      Alert.alert("Success", "Progress added successfully");
      reset();
      onClose();
    },
    onError: (error: any) => {
      Alert.alert("Error", error?.response?.data?.message || "Failed to add progress");
    },
  });

  const onSubmit = (data: TAddProgressFormFormData) => {
    addProgressMutation.mutate({
      taskId,
      completed: data.completed.trim(),
      planned: data.planned.trim(),
      blockers: data.blockers.trim(),
      type: "task",
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
      disabled: addProgressMutation.isPending,
    },
    {
      label: "Submit",
      onPress: () => {
        handleSubmit(onSubmit)();
      },
      variant: "primary",
      disabled: addProgressMutation.isPending,
      loading: addProgressMutation.isPending,
    },
  ];

  return (
    <Sheet
      visible={visible}
      onClose={onClose}
      heading="Add Progress"
      icon={<FontAwesome5 name="tasks" size={20} color="#E30464" />}
      actionButtons={actionButtons}
      height={76}
    >
      <View style={styles.formGroup}>
        <Text style={styles.label}>Completed</Text>
        <Text style={styles.labelHint}>What did you complete?</Text>
        <Controller
          control={control}
          name="completed"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[styles.input, styles.textArea, errors.completed && styles.inputError]}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Describe what you completed..."
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          )}
        />
        {errors.completed && <Text style={styles.errorText}>{errors.completed.message}</Text>}
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Planned</Text>
        <Text style={styles.labelHint}>What do you plan to do next?</Text>
        <Controller
          control={control}
          name="planned"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[styles.input, styles.textArea, errors.planned && styles.inputError]}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Describe what you plan to do..."
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          )}
        />
        {errors.planned && <Text style={styles.errorText}>{errors.planned.message}</Text>}
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Blockers</Text>
        <Text style={styles.labelHint}>Any blockers or issues?</Text>
        <Controller
          control={control}
          name="blockers"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[styles.input, styles.textArea, errors.blockers && styles.inputError]}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Describe any blockers..."
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          )}
        />
        {errors.blockers && <Text style={styles.errorText}>{errors.blockers.message}</Text>}
      </View>
    </Sheet>
  );
}
