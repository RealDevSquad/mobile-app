import React, { useState } from "react";
import { ActivityIndicator, Modal, StyleSheet, Text, View } from "react-native";
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

  const githubOAuthUrl = `${appConfig.backendBaseUrl}/auth/github/login?sourceUtm=rds-mobile-app&redirectURL=mobileapp20://auth`;

  const handleNavigationStateChange = (navState: any) => {
    const { url } = navState;
    onNavigationStateChange(url);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <View style={styles.dragHandle} />
            <Text style={styles.headerTitle}>Sign in with GitHub</Text>
          </View>

          {loading && (
            <View style={styles.loadingContainer}>
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
