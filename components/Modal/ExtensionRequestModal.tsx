import { ExtensionRequestsApi } from '@/api/extension-requests/extension-requests.api';
import {
  extensionRequestSchema,
  TExtensionRequestFormData,
} from '@/api/extension-requests/extension-requests.schema';
import FormDatePicker from '@/components/form/FormDatePicker';
import FormInput from '@/components/form/FormInput';
import FormSubmitButton from '@/components/form/FormSubmitButton';
import { theme } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  formatDate,
  dateToUnix,
  addDaysToUnix,
} from '@/common/utils/dateUtils';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface ExtensionRequestModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: () => void;
  taskId: string;
  oldEndsOn: number;
  assignee: string;
}

interface ExtensionRequestData {
  assignee: string;
  newEndsOn: number;
  oldEndsOn: number;
  reason: string;
  status: 'PENDING';
  taskId: string;
  title: string;
}

const ExtensionRequestModal: React.FC<ExtensionRequestModalProps> = ({
  visible,
  onClose,
  onSubmit,
  taskId,
  oldEndsOn,
  assignee,
}) => {
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<TExtensionRequestFormData>({
    resolver: zodResolver(extensionRequestSchema),
    defaultValues: {
      title: '',
      reason: '',
      newDeadline: undefined,
      taskId,
      assignee,
      oldEndsOn,
    },
  });

  const createExtensionRequestMutation = useMutation({
    mutationFn: (extensionData: {
      assignee: string;
      newEndsOn: number;
      oldEndsOn: number;
      reason: string;
      status: 'PENDING';
      taskId: string;
      title: string;
    }) => ExtensionRequestsApi.createExtensionRequest.fn(extensionData),
    onSuccess: () => {
      Alert.alert('Success', 'Extension request submitted successfully!', [
        {
          text: 'OK',
          onPress: () => {
            reset();
            // Invalidate extension request queries
            queryClient.invalidateQueries({
              queryKey: ['ExtensionRequestsApi.getExtensionRequests'],
            });
            queryClient.invalidateQueries({
              queryKey: ['ExtensionRequestsApi.getSelfExtensionRequests'],
            });
            onSubmit();
          },
        },
      ]);
    },
    onError: (error) => {
      Alert.alert(
        'Error',
        error instanceof Error
          ? error.message
          : 'Failed to submit extension request'
      );
    },
  });

  const handleFormSubmit = (data: TExtensionRequestFormData) => {
    const extensionRequestData: ExtensionRequestData = {
      assignee: data.assignee,
      newEndsOn: dateToUnix(data.newDeadline),
      oldEndsOn: data.oldEndsOn,
      reason: data.reason.trim(),
      status: 'PENDING',
      taskId: data.taskId,
      title: data.title.trim(),
    };

    createExtensionRequestMutation.mutate(extensionRequestData);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const oldDeadlineDate = formatDate(oldEndsOn);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Close Icon */}
          <TouchableOpacity
            style={styles.closeIcon}
            onPress={handleClose}
            disabled={createExtensionRequestMutation.isPending}
            testID="close-button"
          >
            <Ionicons
              name="close"
              size={24}
              color={theme.colors.text.primary}
            />
          </TouchableOpacity>

          <Text style={styles.title}>Raise Extension Request</Text>

          {/* Current Deadline Info */}
          <View style={styles.infoSection}>
            <Text style={styles.infoLabel}>Current Deadline:</Text>
            <Text style={styles.infoValue}>{oldDeadlineDate}</Text>
          </View>

          <View style={styles.form}>
            {/* Title Input */}
            <Controller
              control={control}
              name="title"
              render={({ field: { onChange, value } }) => (
                <FormInput
                  label="Title"
                  placeholder="Enter extension request title"
                  required
                  errorMessage={errors.title?.message}
                  icon="document-text-outline"
                  editable={!createExtensionRequestMutation.isPending}
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />

            {/* Reason Input */}
            <Controller
              control={control}
              name="reason"
              render={({ field: { onChange, value } }) => (
                <FormInput
                  label="Reason"
                  placeholder="Explain why you need an extension"
                  required
                  errorMessage={errors.reason?.message}
                  icon="chatbubble-outline"
                  multiline
                  numberOfLines={4}
                  style={styles.textArea}
                  editable={!createExtensionRequestMutation.isPending}
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />

            {/* New Deadline Picker */}
            <Controller
              control={control}
              name="newDeadline"
              render={({ field: { onChange, value } }) => (
                <FormDatePicker
                  label="New Deadline"
                  value={value}
                  onDateChange={onChange}
                  placeholder="Select new deadline"
                  required
                  errorMessage={errors.newDeadline?.message}
                  icon="calendar-outline"
                  minimumDate={addDaysToUnix(oldEndsOn, 1)}
                  disabled={createExtensionRequestMutation.isPending}
                />
              )}
            />
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <FormSubmitButton
              text="Cancel"
              onPress={handleClose}
              variant="secondary"
              isDisabled={createExtensionRequestMutation.isPending}
            />

            <FormSubmitButton
              text="Submit Request"
              onPress={handleSubmit(handleFormSubmit)}
              isLoading={createExtensionRequestMutation.isPending}
              isDisabled={!isDirty || createExtensionRequestMutation.isPending}
            />
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
    width: '100%',
    maxWidth: 400,
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    ...theme.shadow.lg,
  },
  closeIcon: {
    position: 'absolute',
    top: theme.spacing.md,
    right: theme.spacing.md,
    zIndex: 1,
    padding: theme.spacing.xs,
  },
  title: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.lg,
    marginTop: theme.spacing.sm,
    marginRight: theme.spacing.xl,
    textAlign: 'center',
  },
  infoSection: {
    backgroundColor: theme.colors.background.secondary,
    padding: theme.spacing.sm,
    borderRadius: theme.radius.sm,
    marginBottom: theme.spacing.md,
  },
  infoLabel: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  infoValue: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.primary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  form: {
    marginTop: theme.spacing.lg,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  button: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.sm,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: theme.colors.background.secondary,
    borderWidth: 1,
    borderColor: theme.colors.border.secondary,
  },
  cancelButtonText: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.secondary,
  },
  submitButton: {
    backgroundColor: theme.colors.legacy.primary,
  },
  submitButtonText: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.inverted,
  },
  disabledInput: {
    backgroundColor: theme.colors.background.secondary,
    color: theme.colors.text.disabled,
  },
  disabledButton: {
    backgroundColor: theme.colors.gray[300],
  },
});

export default ExtensionRequestModal;
