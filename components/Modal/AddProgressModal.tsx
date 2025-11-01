import { TasksApi } from '@/api/tasks/tasks.api';
import {
  addProgressSchema,
  TAddProgressFormData,
} from '@/api/tasks/tasks.schema';
import FormInput from '@/components/form/FormInput';
import { theme } from '@/constants/theme';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react';
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

interface AddProgressModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: () => void;
  taskId: string;
}

export default function AddProgressModal({
  visible,
  onClose,
  onSubmit,
  taskId,
}: AddProgressModalProps) {
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<TAddProgressFormData>({
    resolver: zodResolver(addProgressSchema),
    defaultValues: {
      completed: '',
      planned: '',
      blockers: '',
    },
  });

  const submitProgressMutation = useMutation({
    mutationFn: (progressData: {
      type: string;
      taskId: string;
      completed: string;
      planned: string;
      blockers: string;
    }) => TasksApi.submitProgress.fn(progressData),
    onSuccess: () => {
      Alert.alert('Success', 'Progress updated successfully');
      reset();
      queryClient.invalidateQueries({ queryKey: ['TasksApi.getSelfTasks'] });
      queryClient.invalidateQueries({ queryKey: ['TasksApi.getTaskDetails'] });
      queryClient.invalidateQueries({ queryKey: ['TasksApi.getTaskProgress'] });
      onSubmit();
      onClose();
    },
    onError: (error) => {
      console.error('Error submitting progress:', error);
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'Failed to submit progress'
      );
    },
  });

  const handleFormSubmit = (data: TAddProgressFormData) => {
    submitProgressMutation.mutate({
      type: 'task',
      taskId,
      completed: data.completed?.trim() || '',
      planned: data.planned?.trim() || '',
      blockers: data.blockers?.trim() || '',
    });
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.overlayTouchable}
          activeOpacity={1}
          onPress={handleClose}
        />
        <TouchableOpacity
          style={styles.modalContainer}
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
        >
          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
          >
            <View>
              <Text style={styles.sectionTitle}>Add Task Update</Text>
              <Text style={styles.sectionSubtitle}>
                On{' '}
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </Text>
            </View>

            <View style={styles.form}>
              <Controller
                control={control}
                name="completed"
                render={({ field: { onChange, value } }) => (
                  <FormInput
                    label="Completed"
                    placeholder="What have you completed since the last update?"
                    errorMessage={errors.completed?.message}
                    icon="checkmark-circle-outline"
                    multiline
                    numberOfLines={3}
                    style={styles.textInput}
                    value={value}
                    onChangeText={onChange}
                  />
                )}
              />

              <Controller
                control={control}
                name="planned"
                render={({ field: { onChange, value } }) => (
                  <FormInput
                    label="Planned"
                    placeholder="What do you plan to work on next?"
                    errorMessage={errors.planned?.message}
                    icon="calendar-outline"
                    multiline
                    numberOfLines={3}
                    style={styles.textInput}
                    value={value}
                    onChangeText={onChange}
                  />
                )}
              />

              <Controller
                control={control}
                name="blockers"
                render={({ field: { onChange, value } }) => (
                  <FormInput
                    label="Blockers"
                    placeholder="Any issues or blockers preventing progress?"
                    errorMessage={errors.blockers?.message}
                    icon="warning-outline"
                    multiline
                    numberOfLines={3}
                    style={styles.textInput}
                    value={value}
                    onChangeText={onChange}
                  />
                )}
              />
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleClose}
              disabled={submitProgressMutation.isPending}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                styles.submitButton,
                (!isDirty || submitProgressMutation.isPending) &&
                  styles.disabledButton,
              ]}
              onPress={handleSubmit(handleFormSubmit)}
              disabled={!isDirty || submitProgressMutation.isPending}
            >
              {submitProgressMutation.isPending ? (
                <Text style={styles.submitButtonText}>Submitting...</Text>
              ) : (
                <Text style={styles.submitButtonText}>Submit</Text>
              )}
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  overlayTouchable: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.radius.lg,
    width: '100%',
    maxHeight: '80%',
    padding: theme.spacing.md,
    ...theme.shadow.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.primary,
  },
  closeButton: {
    padding: theme.spacing.xs,
  },
  title: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  placeholder: {
    width: 28,
  },
  content: {
    maxHeight: 450,
    padding: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  sectionSubtitle: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
  },
  form: {
    marginTop: theme.spacing.md,
  },
  textInput: {
    backgroundColor: theme.colors.surface.primary,
    borderWidth: 1,
    borderColor: theme.colors.border.secondary,
    borderRadius: theme.radius.sm,
    padding: theme.spacing.sm,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.primary,
    minHeight: 70,
    textAlignVertical: 'top',
    ...theme.shadow.sm,
  },
  footer: {
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
});
