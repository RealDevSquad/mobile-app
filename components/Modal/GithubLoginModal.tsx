import { theme } from '@/constants/theme';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import WebView from 'react-native-webview';

type GitHubLoginModalProps = {
  visible: boolean;
  animation: Animated.Value;
  url: string;
  onClose: () => void;
  onNavigationStateChange: (navState: any) => void;
};

const GitHubLoginModal: React.FC<GitHubLoginModalProps> = ({
  visible,
  animation,
  url,
  onClose,
  onNavigationStateChange,
}) => {
  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.modal,
        {
          transform: [{ translateY: animation }],
        },
      ]}
      testID="github-modal-container"
    >
      <TouchableOpacity
        style={styles.closeButton}
        onPress={onClose}
        testID="close-button"
        activeOpacity={0.7}
      >
        <FontAwesome name="times" size={24} color={theme.colors.text.primary} />
      </TouchableOpacity>
      <WebView
        onNavigationStateChange={onNavigationStateChange}
        source={{ uri: url }}
        incognito
        style={{ flex: 1 }}
        testID="github-webview"
      />
    </Animated.View>
  );
};

export default GitHubLoginModal;

const styles = StyleSheet.create({
  modal: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '100%',
    backgroundColor: theme.colors.background.primary,
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
    ...theme.shadow.xl,
  },
  closeButton: {
    position: 'absolute',
    top: theme.spacing.md,
    right: theme.spacing.md,
    zIndex: 10,
    padding: theme.spacing.xs,
  },
});
