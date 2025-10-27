import {
  statusUpdateSchema,
  TStatusUpdateFormData,
} from '@/api/users/users.schema';
import FormDatePicker from '@/components/form/FormDatePicker';
import FormInput from '@/components/form/FormInput';
import FormSubmitButton from '@/components/form/FormSubmitButton';
import { theme } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface StatusUpdateFormProps {
  onSubmit: (fromDate: Date, toDate: Date, description: string) => void;
  onClose: () => void;
}

const StatusUpdateForm: React.FC<StatusUpdateFormProps> = ({
  onSubmit,
  onClose,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<TStatusUpdateFormData>({
    resolver: zodResolver(statusUpdateSchema),
    defaultValues: {
      fromDate: undefined,
      toDate: undefined,
      description: '',
    },
  });

  const handleFormSubmit = (data: TStatusUpdateFormData) => {
    onSubmit(data.fromDate, data.toDate, data.description);
    reset();
  };

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        style={styles.closeIcon}
        onPress={onClose}
        testID="close-button"
      >
        <Ionicons name="close" size={24} color="#333" />
      </TouchableOpacity>

      <Text style={styles.title}>Update Task</Text>

      <View style={styles.form}>
        <Controller
          control={control}
          name="fromDate"
          render={({ field: { onChange, value } }) => (
            <FormDatePicker
              label="From Date"
              value={value}
              onDateChange={onChange}
              placeholder="Select From Date"
              required
              errorMessage={errors.fromDate?.message}
              icon="calendar-outline"
            />
          )}
        />

        <Controller
          control={control}
          name="toDate"
          render={({ field: { onChange, value } }) => (
            <FormDatePicker
              label="To Date"
              value={value}
              onDateChange={onChange}
              placeholder="Select To Date"
              required
              errorMessage={errors.toDate?.message}
              icon="calendar-outline"
            />
          )}
        />

        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, value } }) => (
            <FormInput
              label="Description"
              placeholder="Add description"
              required
              errorMessage={errors.description?.message}
              icon="document-text-outline"
              multiline
              numberOfLines={4}
              style={styles.textArea}
              value={value}
              onChangeText={onChange}
            />
          )}
        />

        <FormSubmitButton
          text="Submit"
          onPress={handleSubmit(handleFormSubmit)}
          isDisabled={!isDirty}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginTop: theme.spacing.lg,
    width: '90%',
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.background.primary,
    ...theme.shadow.lg,
    alignSelf: 'center',
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
    height: 100,
    textAlignVertical: 'top',
  },
});

export default StatusUpdateForm;
