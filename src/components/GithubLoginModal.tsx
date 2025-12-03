import React, { useState } from "react";
import { ActivityIndicator, Modal, StyleSheet, Text, View, useColorScheme } from "react-native";
import { WebView } from "react-native-webview";
import { appConfig } from "../config/app.config";

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
  const [loading, setLoading] = useState(true);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const githubOAuthUrl = `${appConfig.backendBaseUrl}/auth/github/login?sourceUtm=rds-mobile-app&redirectURL=mobileapp20://auth`;

  const handleNavigationStateChange = (navState: any) => {
    const { url } = navState;
    onNavigationStateChange(url);
  };

  const dynamicStyles = {
    modalContent: [styles.modalContent, isDark && { backgroundColor: "#1F2937" }],
    header: [styles.header, isDark && { backgroundColor: "#1F2937", borderBottomColor: "#374151" }],
    dragHandle: [styles.dragHandle, isDark && { backgroundColor: "#6B7280" }],
    headerTitle: [styles.headerTitle, isDark && { color: "#FFFFFF" }],
    loadingContainer: [
      styles.loadingContainer,
      isDark && { backgroundColor: "rgba(31, 41, 55, 0.9)" },
    ],
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={dynamicStyles.modalContent}>
          <View style={dynamicStyles.header}>
            <View style={dynamicStyles.dragHandle} />
            <Text style={dynamicStyles.headerTitle}>Sign in with GitHub</Text>
          </View>

          {loading && (
            <View style={dynamicStyles.loadingContainer}>
              <ActivityIndicator size="large" color="#E30464" />
            </View>
          )}

          <WebView
            source={{ uri: githubOAuthUrl }}
            onNavigationStateChange={handleNavigationStateChange}
            onLoadStart={() => setLoading(true)}
            onLoadEnd={() => setLoading(false)}
            incognito={true}
            style={styles.webview}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    height: "80%",
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
  },
  header: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#e0e0e0",
    borderRadius: 2,
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  closeButton: {
    padding: 6,
  },
  loadingContainer: {
    position: "absolute",
    top: 60,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    zIndex: 1,
  },
  webview: {
    flex: 1,
  },
});
