import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import Slider from "@react-native-community/slider";
import { TasksApi } from "../../../api/tasks/tasks.api";
import { TaskDetailsDTO } from "../../../api/tasks/task.dto";
import {
  updateTaskStatusFormSchema,
  TUpdateTaskStatusFormData,
} from "../../../api/tasks/tasks.schema";
import { formatStatus } from "../../../utils/common.utils";
import { Sheet, ActionButton } from "../../../components/Sheet";
import styles from "./update-task-modal.styles";

const STATUS_OPTIONS = [
  "ASSIGNED",
  "IN_PROGRESS",
  "BLOCKED",
  "SMOKE_TESTING",
  "NEEDS_REVIEW",
  "IN_REVIEW",
  "APPROVED",
  "MERGED",
  "SANITY_CHECK",
  "REGRESSION_CHECK",
  "RELEASED",
  "VERIFIED",
  "DONE",
  "BACKLOG",
  "OVERDUE",
];

type UpdateTaskModalProps = {
  visible: boolean;
  onClose: () => void;
  taskId: string;
  task: TaskDetailsDTO["taskData"];
};

export function UpdateTaskModal({ visible, onClose, taskId, task }: UpdateTaskModalProps) {
  const queryClient = useQueryClient();
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TUpdateTaskStatusFormData>({
    resolver: zodResolver(updateTaskStatusFormSchema as any),
    defaultValues: {
      status: task.status,
      percentCompleted: task.percentCompleted,
    },
  });

  const mutation = useMutation({
    mutationFn: (data: { status: string; percentCompleted: number }) =>
      TasksApi.updateTaskStatus.fn(taskId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: TasksApi.getTaskDetails.key(taskId),
      });
      queryClient.invalidateQueries({
        queryKey: TasksApi.getTasks.key(),
      });
      queryClient.invalidateQueries({
        queryKey: TasksApi.getSelfTasks.key,
      });
      Alert.alert("Success", "Task updated successfully");
      reset();
      onClose();
    },
    onError: (error: any) => {
      Alert.alert("Error", error?.response?.data?.message || "Failed to update task");
    },
  });

  const onSubmit = (data: TUpdateTaskStatusFormData) => {
    mutation.mutate({
      status: data.status,
      percentCompleted: Math.round(data.percentCompleted),
    });
  };

  const handleStatusSelect = (selectedStatus: string, onChange: (value: string) => void) => {
    onChange(selectedStatus);
    setShowStatusDropdown(false);
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
      heading="Update Task"
      icon={<FontAwesome5 name="sync-alt" size={20} color="#E30464" />}
      actionButtons={actionButtons}
      height={60}
    >
      <View style={styles.formGroup}>
        <Text style={styles.label}>Status</Text>
        <Controller
          control={control}
          name="status"
          render={({ field: { onChange, value } }) => (
            <>
              <Pressable
                style={styles.dropdownButton}
                onPress={() => setShowStatusDropdown(!showStatusDropdown)}
              >
                <Text style={styles.dropdownButtonText}>{formatStatus(value)}</Text>
                <FontAwesome5
                  name={showStatusDropdown ? "chevron-up" : "chevron-down"}
                  size={14}
                  color="#6B7280"
                />
              </Pressable>

              {showStatusDropdown && (
                <View style={styles.dropdownList}>
                  <ScrollView style={styles.dropdownScrollView} nestedScrollEnabled>
                    {STATUS_OPTIONS.map((option) => (
                      <Pressable
                        key={option}
                        style={[
                          styles.dropdownItem,
                          value === option && styles.dropdownItemSelected,
                        ]}
                        onPress={() => handleStatusSelect(option, onChange)}
                      >
                        <Text
                          style={[
                            styles.dropdownItemText,
                            value === option && styles.dropdownItemTextSelected,
                          ]}
                        >
                          {formatStatus(option)}
                        </Text>
                        {value === option && (
                          <FontAwesome5 name="check" size={14} color="#E30464" />
                        )}
                      </Pressable>
                    ))}
                  </ScrollView>
                </View>
              )}
            </>
          )}
        />
        {errors.status && <Text style={styles.errorText}>{errors.status.message}</Text>}
      </View>

      <View style={styles.formGroup}>
        <Controller
          control={control}
          name="percentCompleted"
          render={({ field: { onChange, value } }) => (
            <>
              <View style={styles.progressHeader}>
                <Text style={styles.label}>Progress</Text>
                <Text style={styles.progressValue}>{Math.round(value)}%</Text>
              </View>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={100}
                value={value}
                onValueChange={onChange}
                minimumTrackTintColor="#E30464"
                maximumTrackTintColor="#E5E7EB"
                thumbTintColor="#E30464"
                step={1}
              />
              <View style={styles.progressLabels}>
                <Text style={styles.progressLabel}>0%</Text>
                <Text style={styles.progressLabel}>100%</Text>
              </View>
            </>
          )}
        />
        {errors.percentCompleted && (
          <Text style={styles.errorText}>{errors.percentCompleted.message}</Text>
        )}
      </View>
    </Sheet>
  );
}
