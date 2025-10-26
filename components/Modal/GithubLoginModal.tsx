import { theme } from "@/constants/theme";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import React from "react";
import { Animated, StyleSheet, TouchableOpacity } from "react-native";
import WebView from "react-native-webview";

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
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: "100%",
    backgroundColor: theme.colors.background.primary,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
    backgroundColor: theme.colors.primary[500],
    borderRadius: 50,
    padding: 5,
  },
});
