import { setLocalStorageItem } from "@/common/utils/common";
import { TOKEN_KEY } from "@/constants/constants";
import useCheckUserSession from "@/hooks/getUserToken";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Camera} from "expo-camera";
import * as Device from "expo-device";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  Easing,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AuthApi from "../../constants/apiConstant/auth-api";
import ToastManager, { Toast } from "toastify-react-native";
import CameraModal from "@/components/Modal/CameraModal";
import GitHubLoginModal from "@/components/Modal/GithubLoginModal";


const toastConfig = {
  success: (props: { text1: string; text2?: string }) => (
    <View style={{ backgroundColor: "#4CAF50", padding: 16, borderRadius: 10 }}>
      <Text style={{ color: "white", fontWeight: "bold" }}>{props.text1}</Text>
      {props.text2 && <Text style={{ color: "white" }}>{props.text2}</Text>}
    </View>
  ),
  // Override other toast types as needed
};

function buildUrl(url: string, params: { [key: string]: string }) {
  const queryString = Object.keys(params)
    .map((key) => `${key}=${encodeURIComponent(params[key])}`)
    .join("&");
  return `${url}?${queryString}`;
}

const AuthScreen = () => {
  const router = useRouter();
  const [modalAnimation] = useState(
    new Animated.Value(Dimensions.get("window").height)
  );

  const { token: storedToken } = useCheckUserSession();

  const [githubLogin, setGithubLogin] = useState(false);
  const [cameraVisible, setCameraVisible] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [scannedUserId, setScannedUserId] = useState("");
  const [showModal, setShowModal] = useState(false);

  const openModal = () => {
    Animated.timing(modalAnimation, {
      toValue: Dimensions.get("window").height * 0.2, // Adjust the final position
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(modalAnimation, {
      toValue: Dimensions.get("window").height, // Move back off-screen
      duration: 300,
      easing: Easing.in(Easing.ease),
      useNativeDriver: false,
    }).start(() => setGithubLogin(false));
  };

  useEffect(() => {
    if (githubLogin) {
      openModal();
    }
  }, [githubLogin]);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const queryParams = {
    sourceUtm: "rds-mobile-app",
    redirectURL: "rdsapp://auth",
  };

  const githubAuthUrl = buildUrl(AuthApi.GITHUB_AUTH_API, queryParams);

  const handleNavigationStateChange = (navState: any) => {
    if (navState.url.includes("token=")) {
      try {
        const urlObj = new URL(navState.url);
        const token = urlObj.searchParams.get("token");
        if (token) {
          setLocalStorageItem(TOKEN_KEY, token);
          setGithubLogin(false);
          router.replace("/(tabs)/(home)");
        }
      } catch (error) {
        console.error("Error parsing URL:", error);
      }
    }
  };

  const handleSignIn = () => {
    setGithubLogin(true);
  };

  const handleSignInWithWeb = () => {
    setCameraVisible(true);
  };

  const qrCodeLogin = async () => {
    const deviceId = Device.osBuildId;
    const url = `${AuthApi.QR_AUTH_API}?device_id=${deviceId}`;
    try {
      const userInfo = await fetch(url);
      const userInfoJson = await userInfo.json();
      if (userInfoJson.data.token) {
        setLocalStorageItem(TOKEN_KEY, userInfoJson.data.token);
        setCameraVisible(false);
        router.replace("/(tabs)/(home)");
      } else {
        Toast.show({
          type: "error",
          text1: "Please authorize from my-site by giving confirmations",
          position: "bottom",
          bottomOffset: 80,
        });
        setScannedUserId("")
      }
    } catch (err) {
      console.error("Error during QR code login:", err);
      Toast.show({
        type: "error",
        text1: "Something went wrong, please try again later",
        position: "bottom",
        bottomOffset: 80,
      });
    }
  };

  const getAuthStatus = async () => {
    const deviceInfo = Device.modelName;
    const deviceId = Device.osBuildId;
    const url = `${AuthApi.QR_AUTH_API}?device_id=${deviceId}`;
    try {
      const data = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          device_info: deviceInfo,
          user_id: scannedUserId,
          device_id: deviceId,
        }),
      });

      if (data.ok) {
        const dataJson = await data.json();
        Alert.alert("Please Confirm", dataJson.message, [
          {
            text: "Cancel",
            onPress: () => {          
              setCameraVisible(false)
              setScannedUserId("")
            }
          },
          {
            text: "OK",
            onPress: () => {
              setShowModal(true); 
            },
          },
        ]);
      } else {
        await data.json();
        Toast.show({
          type: 'error',
          text1: 'Something went wrong, please try again',
          position: 'bottom',
          bottomOffset: 80,
        });
      }
    } catch (err) {
      Toast.show({
        type: 'error',
        text1:
          (err as Error).message || 'Something went wrong, please try again',
        position: 'bottom',
        bottomOffset: 80,
      });
    }
  };

  useEffect(() => {
    if (scannedUserId !== "") {
      getAuthStatus();
    }
  }, [scannedUserId]);

  useEffect(() => {
    if (storedToken) {
      router.replace("/(tabs)/(home)");
    }
  }, [storedToken]);


  if (cameraVisible) {
    if (!hasPermission) {
      return (
        <View style={styles.container}>
          <Text style={styles.message}>
            Camera permission is required to scan QR codes.
          </Text>
        </View>
      );
    }

    return (
      <CameraModal
      onBarcodeScanned={(data) => setScannedUserId(data)}
      onClose={() => setCameraVisible(false)}
      showModal={showModal}
      qrCodeLogin={() => {
        qrCodeLogin();
        setCameraVisible(false);
        setShowModal(false);
      }}
    />
      )
  }

  return (
    <View style={styles.container}>
      {githubLogin ? (
        <GitHubLoginModal
          visible={githubLogin}
          animation={modalAnimation}
          url={githubAuthUrl}
          onClose={closeModal}
          onNavigationStateChange={handleNavigationStateChange}
        />
      ) : (
        <View style={styles.content}>
          <Image
            source={require("../../assets/images/rdsLogo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Welcome to</Text>
          <Text style={styles.title1}>REAL DEV SQUAD</Text>

          <TouchableOpacity
            style={[styles.button, styles.githubButton]}
            onPress={handleSignIn}
          >
            <FontAwesome name="github" size={24} color="#fff" />
            <Text style={styles.buttonText}>GitHub Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.webButton]}
            onPress={handleSignInWithWeb}
          >
            <FontAwesome name="qrcode" size={24} color="#fff" />
            <Text style={styles.buttonText}>Web Login </Text>
          </TouchableOpacity>
        </View>
      )}
      <ToastManager config={toastConfig} />
    </View>
  );
};

export default AuthScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1A1A2E",
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    color: "#E94560",
    fontWeight: "600",
    marginBottom: 5,
  },
  title1: {
    fontSize: 32,
    color: "#FFF",
    fontWeight: "bold",
    marginBottom: 40,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 15,
    width: 250,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  githubButton: {
    backgroundColor: "#333",
  },
  webButton: {
    backgroundColor: "#E94560",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 10,
  },
  message: {
    color: "#FFF",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
  },
});
