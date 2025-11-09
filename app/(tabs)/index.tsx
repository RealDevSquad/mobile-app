import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useState } from "react";
import { Alert, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { GithubLoginModal } from "../../src/components/GithubLoginModal";
import { useAuthStore } from "../../src/store/authStore";
import { secureStorage } from "../../src/utils/storage";
import { HomeScreen } from "../../src/modules/home";

export default function WelcomeScreen() {
  const [githubLogin, setGithubLogin] = useState(false);
  const { setToken, isAuthenticated } = useAuthStore();

  const handleSignIn = () => {
    setGithubLogin(true);
  };

  const handleNavigationStateChange = (url: string) => {
    if (url.includes("token=")) {
      try {
        const urlObj = new URL(url);
        const token = urlObj.searchParams.get("token");

        if (token) {
          secureStorage.setItem("auth_token", token);

          setToken(token);

          setGithubLogin(false);

          Alert.alert("Success", "Logged in successfully!", [
            {
              text: "OK",
            },
          ]);
        }
      } catch (error) {
        console.error("Error parsing token from URL:", error);
        Alert.alert("Error", "Failed to extract authentication token");
        setGithubLogin(false);
      }
    }

    if (url.includes("error=")) {
      try {
        const urlObj = new URL(url);
        const error = urlObj.searchParams.get("error");
        Alert.alert("Authentication Error", error || "Unknown error");
        setGithubLogin(false);
      } catch {
        Alert.alert("Authentication Error", "An error occurred");
        setGithubLogin(false);
      }
    }

    if (url.startsWith("mobileapp20://auth")) {
      if (url.includes("token=")) {
        try {
          const urlObj = new URL(url);
          const token = urlObj.searchParams.get("token");

          if (token) {
            secureStorage.setItem("auth_token", token);
            setToken(token);
            setGithubLogin(false);
            Alert.alert("Success", "Logged in successfully!");
          }
        } catch (error) {
          console.error("Error parsing redirect URL:", error);
        }
      }
    }
  };

  if (!isAuthenticated) {
    return (
      <>
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <Image
              source={require("../../assets/images/rdsLogo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.welcomeText}>Welcome to RDS!</Text>
            <Text style={styles.subtitle}>
              Community of developers, designers, PMs, and others who collaborate to build Real
              software
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <Text style={styles.homeSubtitle}>Sign in to your account to continue</Text>
            <Pressable style={[styles.button, styles.githubButton]} onPress={handleSignIn}>
              <FontAwesome5 name="github" size={20} color="#fff" style={styles.icon} />
              <Text style={styles.buttonText}>Continue with GitHub</Text>
            </Pressable>

            <Pressable
              style={[styles.button, styles.googleButton, styles.comingSoon]}
              disabled={true}
            >
              <FontAwesome5 name="google" size={20} color="#fff" style={styles.icon} />
              <Text style={styles.buttonText}>Continue with Google</Text>
              <Text style={styles.comingSoonBadge}>Coming Soon</Text>
            </Pressable>
          </View>
        </View>

        <GithubLoginModal
          visible={githubLogin}
          onClose={() => setGithubLogin(false)}
          onNavigationStateChange={handleNavigationStateChange}
        />
      </>
    );
  }

  return <HomeScreen />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  headerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginTop: 40,
  },
  homeContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  logo: {
    width: 200,
    height: 100,
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 40,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  homeTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
    marginTop: 20,
    marginBottom: 10,
  },
  homeSubtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 4,
  },
  buttonContainer: {
    alignItems: "center",
    width: "100%",
    paddingBottom: 20,
  },
  button: {
    width: 320,
    height: 56,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
    paddingHorizontal: 20,
    position: "relative",
  },
  githubButton: {
    backgroundColor: "#24292e",
  },
  googleButton: {
    backgroundColor: "#4285F4",
  },
  comingSoon: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  icon: {
    marginRight: 12,
  },
  comingSoonBadge: {
    position: "absolute",
    top: -8,
    right: 10,
    backgroundColor: "#E30464",
    color: "#fff",
    fontSize: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontWeight: "600",
  },
});
