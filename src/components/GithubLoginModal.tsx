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
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
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
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 28,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  closeButton: {
    padding: 6,
  },
  loadingContainer: {
    position: "absolute",
    top: 0,
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
