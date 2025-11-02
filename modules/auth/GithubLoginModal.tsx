import { theme } from '@/constants/theme';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  StyleSheet,
  TouchableOpacity,
  View,
  useColorScheme,
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
  const colorScheme = useColorScheme();
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);

  const handleLoadStart = () => {
    setIsLoading(true);
  };

  const handleLoad = () => {
    setIsLoading(false);
    setHasLoaded(true);
  };

  const handleError = () => {
    setIsLoading(false);
  };

  useEffect(() => {
    if (visible && !hasLoaded) {
      setIsLoading(true);
    }
  }, [visible, hasLoaded]);

  return (
    <Animated.View
      style={[
        styles.modal,
        {
          transform: [{ translateY: animation }],
          opacity: visible ? 1 : 0,
        },
      ]}
      pointerEvents={visible ? 'auto' : 'none'}
      testID="github-modal-container"
    >
      <TouchableOpacity
        style={styles.closeButton}
        onPress={onClose}
        testID="close-button"
        activeOpacity={0.7}
      >
        <FontAwesome
          name="times"
          size={24}
          color={
            colorScheme === 'dark'
              ? theme.colors.text.inverted
              : theme.colors.text.primary
          }
        />
      </TouchableOpacity>
      {isLoading && visible && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={theme.colors.primary[500]} />
        </View>
      )}
      <WebView
        onNavigationStateChange={onNavigationStateChange}
        onLoadStart={handleLoadStart}
        onLoad={handleLoad}
        onError={handleError}
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
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background.primary,
    zIndex: 5,
  },
});
