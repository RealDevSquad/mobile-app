import { Ionicons } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AuthApis from "../../../components/apiConstant/AuthApi";

const redirectURL = ("realdevsquad://auth/callback");

function buildUrl(url: string, params: { [key: string]: string }): string {
  const queryString = Object.keys(params)
    .map((key) => `${key}=${encodeURIComponent(params[key])}`)
    .join("&");
  return `${url}?${queryString}`;
}


const githubAuthUrl = buildUrl(AuthApis.GITHUB_AUTH_API, {
  sourceUtm: "rds-mobile-app",
  redirectURL: redirectURL,
});


const webSignInUrl = "https://realdevsquad.com";

export default function AuthScreen() {
  const router = useRouter();
  const [authToken, setAuthToken] = useState<string | null>(null);

  useEffect(() => {
    
    const handleDeepLink = (event: { url: string }) => {
      console.log("Received Deep Link:", event.url);

     
      if (!event.url.includes("token=")) {
        console.warn("Deep link does not contain token. Ignoring.");
        return;
      }

      
      const parsedUrl = Linking.parse(event.url);
      console.log("Parsed URL:", JSON.stringify(parsedUrl, null, 2));

      const token = parsedUrl.queryParams?.token;
      if (token) {
        console.log("Extracted Token:", token);
        setAuthToken(token);
      
        router.replace("/screens/HomeScreen");
      } else {
        console.warn("No token found in URL:", event.url);
      }
    };

    
    const subscription = Linking.addEventListener("url", handleDeepLink);

    
    Linking.getInitialURL().then((url) => {
      if (url && url.includes("token=")) {
        handleDeepLink({ url });
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const handleGithubSignIn = async () => {
    try {
      await Linking.openURL(githubAuthUrl);
    } catch (error) {
      console.error("Error opening GitHub sign-in:", error);
    }
  };

  const handleWebSignIn = async () => {
    try {
      await Linking.openURL(webSignInUrl);
    } catch (error) {
      console.error("Error opening Web sign-in:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require("../../../assets/images/rdsLogo.png")} style={styles.logo} />
      <Text style={styles.title}>Welcome to</Text>
      <Text style={styles.subtitle}>REAL DEV SQUAD</Text>

      {/* GitHub Sign-In Button */}
      <TouchableOpacity style={styles.button} onPress={handleGithubSignIn}>
        <Ionicons name="logo-github" size={24} color="black" />
        <Text style={styles.buttonText}>GitHub Sign-In</Text>
      </TouchableOpacity>

      {/* Web Sign-In Button */}
      <TouchableOpacity style={styles.button} onPress={handleWebSignIn}>
        <Ionicons name="globe-outline" size={24} color="black" />
        <Text style={styles.buttonText}>Web Sign-In</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1200AA",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
    resizeMode: "contain",
  },
  title: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  subtitle: {
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 30,
  },
  button: {
    flexDirection: "row",
    backgroundColor: "white",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: "bold",
  },
});
