import { TasksApi } from '@/api/tasks/tasks.api';
import {
  TUpdateTaskStatusFormData,
  updateTaskStatusSchema,
} from '@/api/tasks/tasks.schema';
import { theme } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import Slider from '@react-native-community/slider';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface UpdateTaskStatusModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: () => void;
  taskId: string;
  currentStatus: string;
  currentProgress: number;
}

const STATUS_OPTIONS = [
  'ASSIGNED',
  'IN_PROGRESS',
  'BLOCKED',
  'SMOKE_TESTING',
  'NEEDS_REVIEW',
  'IN_REVIEW',
  'APPROVED',
  'MERGED',
  'SANITY_CHECK',
  'REGRESSION_CHECK',
  'RELEASED',
  'VERIFIED',
  'DONE',
  'COMPLETED',
  'BACKLOG',
  'OVERDUE',
];

const UpdateTaskStatusModal: React.FC<UpdateTaskStatusModalProps> = ({
  visible,
  onClose,
  onSubmit,
  taskId,
  currentStatus,
  currentProgress,
}) => {
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<TUpdateTaskStatusFormData>({
    resolver: zodResolver(updateTaskStatusSchema),
    defaultValues: {
      status: currentStatus,
      percentCompleted: currentProgress,
    },
  });

  const watchedProgress = watch('percentCompleted');

  const updateTaskStatusMutation = useMutation({
    mutationFn: (statusData: { status: string; percentCompleted: number }) =>
      TasksApi.updateTaskStatus.fn(taskId, statusData),
    onSuccess: () => {
      Alert.alert('Success', 'Task status and progress updated successfully.');
      queryClient.invalidateQueries({ queryKey: ['TasksApi.getSelfTasks'] });
      queryClient.invalidateQueries({ queryKey: ['TasksApi.getTaskDetails'] });
      queryClient.invalidateQueries({ queryKey: ['TasksApi.getTaskProgress'] });
      onSubmit();
      onClose();
    },
    onError: (error) => {
      console.error('Error updating task status:', error);
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'Failed to update task status.'
      );
    },
  });

  const handleFormSubmit = (data: TUpdateTaskStatusFormData) => {
    updateTaskStatusMutation.mutate({
      status: data.status,
      percentCompleted: Math.round(data.percentCompleted || 0),
    });
  };

  const handleClose = () => {
    reset();
    setShowStatusDropdown(false);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Update Task Status</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Ionicons
                name="close"
                size={20}
                color={theme.colors.text.primary}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            {/* Status Selection */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Status</Text>
              <Controller
                control={control}
                name="status"
                render={({ field: { onChange, value } }) => (
                  <>
                    <TouchableOpacity
                      style={[
                        styles.dropdown,
                        errors.status && styles.dropdownError,
                      ]}
                      onPress={() => setShowStatusDropdown(!showStatusDropdown)}
                    >
                      <Text style={styles.dropdownText}>{value}</Text>
                      <Ionicons
                        name={
                          showStatusDropdown ? 'chevron-up' : 'chevron-down'
                        }
                        size={18}
                        color={theme.colors.text.secondary}
                      />
                    </TouchableOpacity>

                    {showStatusDropdown && (
                      <View style={styles.dropdownList}>
                        <ScrollView
                          showsVerticalScrollIndicator={true}
                          nestedScrollEnabled={true}
                        >
                          {STATUS_OPTIONS.map((status) => (
                            <TouchableOpacity
                              key={status}
                              style={[
                                styles.dropdownItem,
                                value === status && styles.dropdownItemSelected,
                              ]}
                              onPress={() => {
                                onChange(status);
                                setShowStatusDropdown(false);
                              }}
                            >
                              <Text
                                style={[
                                  styles.dropdownItemText,
                                  value === status &&
                                    styles.dropdownItemTextSelected,
                                ]}
                              >
                                {status}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </ScrollView>
                      </View>
                    )}
                  </>
                )}
              />
              {errors.status && (
                <Text style={styles.errorText}>{errors.status.message}</Text>
              )}
            </View>

            {/* Progress Slider */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Progress: {Math.round(watchedProgress || 0)}%
              </Text>
              <Controller
                control={control}
                name="percentCompleted"
                render={({ field: { onChange, value } }) => (
                  <View style={styles.sliderContainer}>
                    <Text style={styles.sliderLabel}>0%</Text>
                    <Slider
                      style={styles.slider}
                      minimumValue={0}
                      maximumValue={100}
                      value={value || 0}
                      onValueChange={onChange}
                      step={1}
                      minimumTrackTintColor={theme.colors.primary[600]}
                      maximumTrackTintColor={theme.colors.border.secondary}
                      thumbTintColor={theme.colors.primary[600]}
                    />
                    <Text style={styles.sliderLabel}>100%</Text>
                  </View>
                )}
              />
              {errors.percentCompleted && (
                <Text style={styles.errorText}>
                  {errors.percentCompleted.message}
                </Text>
              )}
            </View>

            {/* Current Values Display */}
            <View style={styles.currentValues}>
              <Text style={styles.currentValuesTitle}>Current Values:</Text>
              <Text style={styles.currentValuesText}>
                Status: {currentStatus} | Progress: {currentProgress}%
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleClose}
              disabled={updateTaskStatusMutation.isPending}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                styles.submitButton,
                updateTaskStatusMutation.isPending && styles.disabledButton,
              ]}
              onPress={handleSubmit(handleFormSubmit)}
              disabled={updateTaskStatusMutation.isPending}
            >
              {updateTaskStatusMutation.isPending ? (
                <Text style={styles.submitButtonText}>Updating...</Text>
              ) : (
                <Text style={styles.submitButtonText}>Update Task</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  modalContainer: {
    backgroundColor: theme.colors.surface.primary,
    borderRadius: theme.radius.lg,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
    ...theme.shadow.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.primary,
  },
  title: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  closeButton: {
    padding: theme.spacing.xs,
  },
  content: {
    padding: theme.spacing.md,
  },
  section: {
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.background.tertiary,
    borderWidth: 1,
    borderColor: theme.colors.border.secondary,
    borderRadius: theme.radius.sm,
    padding: theme.spacing.sm,
  },
  dropdownText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.primary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  dropdownList: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: theme.colors.surface.primary,
    borderWidth: 1,
    borderColor: theme.colors.border.secondary,
    borderRadius: theme.radius.sm,
    marginTop: 4,
    maxHeight: 300,
    zIndex: 1000,
    ...theme.shadow.md,
  },
  dropdownItem: {
    padding: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.primary,
  },
  dropdownItemSelected: {
    backgroundColor: theme.colors.primary[50],
  },
  dropdownItemText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.primary,
  },
  dropdownItemTextSelected: {
    color: theme.colors.primary[600],
    fontWeight: theme.typography.fontWeight.semibold,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.xs,
  },
  slider: {
    flex: 1,
    height: 40,
    marginHorizontal: theme.spacing.sm,
  },
  sliderThumb: {
    backgroundColor: theme.colors.primary[600],
    width: 20,
    height: 20,
  },
  sliderLabel: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  currentValues: {
    backgroundColor: theme.colors.background.tertiary,
    padding: theme.spacing.sm,
    borderRadius: theme.radius.sm,
    marginTop: theme.spacing.xs,
  },
  currentValuesTitle: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.secondary,
    marginBottom: 2,
  },
  currentValuesText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.primary,
  },
  actions: {
    flexDirection: 'row',
    padding: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.primary,
    gap: theme.spacing.md,
  },
  button: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: theme.colors.background.tertiary,
    borderWidth: 1,
    borderColor: theme.colors.border.secondary,
  },
  cancelButtonText: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
  },
  submitButton: {
    backgroundColor: theme.colors.primary[600],
  },
  submitButtonText: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.inverted,
  },
  disabledButton: {
    opacity: 0.6,
  },
  dropdownError: {
    borderColor: theme.colors.error[500],
  },
  errorText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.error[500],
    marginTop: 2,
  },
});

export default UpdateTaskStatusModal;
