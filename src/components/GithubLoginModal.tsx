import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Modal,
  PanResponder,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { WebView, WebViewNavigation } from "react-native-webview";
import { appConfig } from "../config/app.config";
import { Colors } from "../styles/common.styles";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.8;
const DISMISS_THRESHOLD = 100;
const DISMISS_ANIMATION_DURATION = 200;

interface GithubLoginModalProps {
  visible: boolean;
  onClose: () => void;
  onNavigationStateChange: (url: string) => void;
}

export function GithubLoginModal({
  visible,
  onClose,
  onNavigationStateChange,
}: GithubLoginModalProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const translateY = useRef(new Animated.Value(0)).current;

  const githubOAuthUrl = `${appConfig.backendBaseUrl}/auth/github/login?sourceUtm=rds-mobile-app&redirectURL=mobileapp20://auth`;

  const resetPosition = useCallback(() => {
    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,
      tension: 100,
      friction: 10,
    }).start();
  }, [translateY]);

  const dismissSheet = useCallback(() => {
    Animated.timing(translateY, {
      toValue: SHEET_HEIGHT,
      duration: DISMISS_ANIMATION_DURATION,
      useNativeDriver: true,
    }).start(() => {
      translateY.setValue(0);
      onClose();
    });
  }, [translateY, onClose]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: (_, gestureState) => {
          return Math.abs(gestureState.dy) > Math.abs(gestureState.dx);
        },
        onPanResponderMove: (_, gestureState) => {
          if (gestureState.dy > 0) {
            translateY.setValue(gestureState.dy);
          }
        },
        onPanResponderRelease: (_, gestureState) => {
          if (gestureState.dy > DISMISS_THRESHOLD) {
            dismissSheet();
          } else {
            resetPosition();
          }
        },
      }),
    [translateY, dismissSheet, resetPosition]
  );

  const handleNavigationStateChange = useCallback(
    (navState: WebViewNavigation) => {
      onNavigationStateChange(navState.url);
    },
    [onNavigationStateChange]
  );

  const handleLoadStart = useCallback(() => {
    setIsLoading(true);
    setHasError(false);
  }, []);

  const handleLoadEnd = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
  }, []);

  const handleRetry = useCallback(() => {
    setHasError(false);
    setIsLoading(true);
  }, []);

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>

        <Animated.View style={[styles.sheet, { transform: [{ translateY }] }]}>
          <View {...panResponder.panHandlers} style={styles.header}>
            <View style={styles.dragHandle} />
            <Text style={styles.headerTitle}>Sign in with GitHub</Text>
          </View>

          <View style={styles.content}>
            {isLoading && <LoadingOverlay />}
            {hasError && <ErrorView onRetry={handleRetry} />}

            <WebView
              source={{ uri: githubOAuthUrl }}
              onNavigationStateChange={handleNavigationStateChange}
              onLoadStart={handleLoadStart}
              onLoadEnd={handleLoadEnd}
              onError={handleError}
              incognito
              style={styles.webview}
            />
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

function LoadingOverlay() {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={Colors.primary} />
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  );
}

interface ErrorViewProps {
  onRetry: () => void;
}

function ErrorView({ onRetry }: ErrorViewProps) {
  return (
    <View style={styles.errorContainer}>
      <Text style={styles.errorTitle}>Unable to load</Text>
      <Text style={styles.errorMessage}>Please check your internet connection and try again.</Text>
      <TouchableWithoutFeedback onPress={onRetry}>
        <View style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.overlay,
  },
  sheet: {
    height: SHEET_HEIGHT,
    backgroundColor: Colors.backgroundWhite,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
  },
  header: {
    alignItems: "center",
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: Colors.backgroundWhite,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderGray,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.borderDark,
    borderRadius: 2,
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  content: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    zIndex: 1,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: Colors.textGray,
  },
  errorContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.backgroundWhite,
    padding: 24,
    zIndex: 1,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    color: Colors.textGray,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textWhite,
  },
});
