import {
  taskRequestFormSchema,
  TTaskRequestFormData,
} from '@/api/tasks/tasks.schema';
import FormDatePicker from '@/components/form/FormDatePicker';
import FormInput from '@/components/form/FormInput';
import FormSubmitButton from '@/components/form/FormSubmitButton';
import { theme } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface TaskRequestModalProps {
  onSubmit: (data: TTaskRequestFormData) => void;
  onClose: () => void;
  isVisible: boolean;
  isLoading?: boolean;
}

const TaskRequestModal: React.FC<TaskRequestModalProps> = ({
  onSubmit,
  onClose,
  isVisible = false,
  isLoading = false,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    watch,
  } = useForm<TTaskRequestFormData>({
    resolver: zodResolver(taskRequestFormSchema),
    defaultValues: {
      proposedStartDate: new Date(),
      proposedDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  const handleFormSubmit = (data: TTaskRequestFormData) => {
    onSubmit(data);
    reset();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!isVisible) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.modalContainer}>
        {/* Close Icon */}
        <TouchableOpacity
          style={styles.closeIcon}
          onPress={handleClose}
          testID="close-button"
        >
          <Ionicons name="close" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>

        <Text style={styles.title}>Request Task Creation</Text>

        <View style={styles.form}>
          {/* Start Date Picker */}
          <Controller
            control={control}
            name="proposedStartDate"
            render={({ field: { onChange, value } }) => (
              <FormDatePicker
                label="Proposed Start Date"
                value={value}
                onDateChange={onChange}
                placeholder="Select Start Date"
                required
                errorMessage={errors.proposedStartDate?.message}
                icon="calendar-outline"
                minimumDate={new Date()}
                disabled={isLoading}
              />
            )}
          />

          {/* Deadline Picker */}
          <Controller
            control={control}
            name="proposedDeadline"
            render={({ field: { onChange, value } }) => (
              <FormDatePicker
                label="Proposed Deadline"
                value={value}
                onDateChange={onChange}
                placeholder="Select Deadline"
                required
                errorMessage={errors.proposedDeadline?.message}
                icon="calendar-outline"
                minimumDate={watch('proposedStartDate') || new Date()}
                disabled={isLoading}
              />
            )}
          />

          {/* Timeline Overview Input */}
          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, value } }) => (
              <FormInput
                label="Timeline Overview"
                placeholder="Explain why you need this much time and your plan"
                required
                errorMessage={errors.description?.message}
                icon="document-text-outline"
                multiline
                numberOfLines={4}
                style={styles.textArea}
                editable={!isLoading}
                value={value}
                onChangeText={onChange}
              />
            )}
          />

          {/* Submit Button */}
          <FormSubmitButton
            text="Create Request"
            onPress={handleSubmit(handleFormSubmit)}
            isLoading={isLoading}
            isDisabled={!isDirty || isLoading}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContainer: {
    width: '90%',
    maxWidth: 400,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.radius.lg,
    ...theme.shadow.lg,
  },
  closeIcon: {
    position: 'absolute',
    top: 14,
    right: 18,
    zIndex: 4,
  },
  title: {
    fontSize: theme.typography.fontSize.xl,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  form: {
    marginTop: theme.spacing.lg,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
});

export default TaskRequestModal;
