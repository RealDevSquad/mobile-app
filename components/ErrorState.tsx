import { theme } from '@/constants/theme';
import React from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type ErrorStateProps = {
  errorMessage?: string;
  defaultMessage?: string;
  onRetry?: () => void | Promise<void>;
  isRetrying?: boolean;
  wrapInSafeArea?: boolean;
};

export const ErrorState: React.FC<ErrorStateProps> = ({
  errorMessage,
  defaultMessage = 'Something went wrong. Please try again.',
  onRetry,
  isRetrying = false,
  wrapInSafeArea = true,
}) => {
  const containerStyle = wrapInSafeArea
    ? styles.container
    : styles.containerNoSafeArea;

  const content = (
    <View style={styles.errorContainer}>
      <Text style={styles.errorText}>
        {errorMessage ? `Error: ${errorMessage}` : defaultMessage}
      </Text>
      {onRetry && (
        <TouchableOpacity
          style={styles.retryButton}
          onPress={onRetry}
          disabled={isRetrying}
        >
          {isRetrying ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.retryButtonText}>Retry</Text>
          )}
        </TouchableOpacity>
      )}
    </View>
  );

  if (wrapInSafeArea) {
    return <SafeAreaView style={containerStyle}>{content}</SafeAreaView>;
  }

  return <View style={containerStyle}>{content}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  containerNoSafeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  errorText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.error[600],
    textAlign: 'center',
    marginBottom: theme.spacing.md,
    fontFamily: theme.typography.fontFamily.regular,
  },
  retryButton: {
    backgroundColor: theme.colors.primary[600],
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.md,
    alignSelf: 'center',
    minWidth: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  retryButtonText: {
    color: theme.colors.text.inverted,
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.base,
  },
});
