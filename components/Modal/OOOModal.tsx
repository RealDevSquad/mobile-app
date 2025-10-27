import { oooFormSchema, TOOOFormData } from '@/api/users/users.schema';
import FormDatePicker from '@/components/form/FormDatePicker';
import FormInput from '@/components/form/FormInput';
import FormSubmitButton from '@/components/form/FormSubmitButton';
import { theme } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface OOOModalProps {
  onSubmit: (fromDate: Date, toDate: Date, reason: string) => void;
  onClose: () => void;
  isVisible: boolean;
  isLoading?: boolean;
}

const OOOModal: React.FC<OOOModalProps> = ({
  onSubmit,
  onClose,
  isVisible,
  isLoading = false,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    watch,
  } = useForm<TOOOFormData>({
    resolver: zodResolver(oooFormSchema),
    defaultValues: {
      fromDate: new Date(),
      toDate: undefined,
      reason: '',
    },
  });

  const handleFormSubmit = (data: TOOOFormData) => {
    onSubmit(data.fromDate, data.toDate, data.reason);
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

        <Text style={styles.title}>Apply for OOO</Text>

        <View style={styles.form}>
          {/* Start Date Picker */}
          <Controller
            control={control}
            name="fromDate"
            render={({ field: { onChange, value } }) => (
              <FormDatePicker
                label="Start Date"
                value={value}
                onDateChange={onChange}
                placeholder="Select Start Date"
                required
                errorMessage={errors.fromDate?.message}
                icon="calendar-outline"
                minimumDate={new Date()}
                disabled={isLoading}
              />
            )}
          />

          {/* End Date Picker */}
          <Controller
            control={control}
            name="toDate"
            render={({ field: { onChange, value } }) => (
              <FormDatePicker
                label="End Date"
                value={value}
                onDateChange={onChange}
                placeholder="Select End Date (After start date)"
                required
                errorMessage={errors.toDate?.message}
                icon="calendar-outline"
                minimumDate={watch('fromDate') || new Date()}
                disabled={isLoading}
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
                placeholder="Enter reason for OOO"
                required
                errorMessage={errors.reason?.message}
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
            text="Apply for OOO"
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

export default OOOModal;
