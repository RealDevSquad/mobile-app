import { theme } from '@/constants/theme';
import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from 'react-native';

type FormSubmitButtonProps = {
  text: string;
  isLoading?: boolean;
  isDisabled?: boolean;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
} & Omit<TouchableOpacityProps, 'onPress'>;

const FormSubmitButton = ({
  text,
  isLoading = false,
  isDisabled = false,
  onPress,
  variant = 'primary',
  style,
  ...props
}: FormSubmitButtonProps) => {
  const isButtonDisabled = isDisabled || isLoading;

  const buttonStyle = [
    styles.button,
    variant === 'primary' ? styles.primaryButton : styles.secondaryButton,
    isButtonDisabled && styles.disabledButton,
    style,
  ];

  const textStyle = [
    styles.buttonText,
    variant === 'primary'
      ? styles.primaryButtonText
      : styles.secondaryButtonText,
    isButtonDisabled && styles.disabledButtonText,
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={isButtonDisabled}
      {...props}
    >
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="small"
            color={
              variant === 'primary'
                ? theme.colors.text.inverted
                : theme.colors.text.primary
            }
          />
          <Text style={[textStyle, styles.loadingText]}>{text}</Text>
        </View>
      ) : (
        <Text style={textStyle}>{text}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    ...theme.shadow.sm,
  },
  primaryButton: {
    backgroundColor: theme.colors.primary[600],
  },
  secondaryButton: {
    backgroundColor: theme.colors.background.secondary,
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
  },
  disabledButton: {
    backgroundColor: theme.colors.gray[300],
    borderColor: theme.colors.gray[300],
  },
  buttonText: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  primaryButtonText: {
    color: theme.colors.text.inverted,
  },
  secondaryButtonText: {
    color: theme.colors.text.primary,
  },
  disabledButtonText: {
    color: theme.colors.gray[600],
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginLeft: theme.spacing.sm,
  },
});

export default FormSubmitButton;
