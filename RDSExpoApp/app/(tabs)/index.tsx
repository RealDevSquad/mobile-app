import { setLocalStorageItem } from "@/common/utils/common";
import { TOKEN_KEY } from "@/constants/constants";
import useCheckUserSession from "@/hooks/getUserToken";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Camera, CameraView } from "expo-camera";
import * as Device from "expo-device";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import WebView from "react-native-webview";
import AuthApi from "../../constants/apiConstant/auth-api";

function buildUrl(url: string, params: { [key: string]: string }) {
  const queryString = Object.keys(params)
    .map((key) => `${key}=${encodeURIComponent(params[key])}`)
    .join("&");
  return `${url}?${queryString}`;
}

const AuthScreen = () => {
  const router = useRouter();
  const [modalAnimation] = useState(new Animated.Value(Dimensions.get("window").height));

  const { token: storedToken } = useCheckUserSession();

  const [githubLogin, setGithubLogin] = useState(false);
  const [cameraVisible, setCameraVisible] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  // const [scannedUserId, setScannedUserID] = useState("");

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
      console.log("Camera permission status:", status);
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

  const handleBarCodeScanned = ({
    type,
    data,
  }: {
    type: string;
    data: string;
  }) => {
    console.log(`QR Code scanned: ${data}`);
    setCameraVisible(false);
    // Handle the scanned QR code data here
  };

  console.log(Device.osBuildId, "Device");

  // const qrCodeLogin = async () => {
  //   console.log("hello");
  //   const deviceId = Device.osBuildId;

  //   console.log(deviceId, "device id");

  //   const url = `${AuthApi.QR_AUTH_API}?device_id=${deviceId}`;
  //   try {
  //     console.log("try");
  //     const userInfo = await fetch(url);
  //     const userInfoJson = await userInfo.json();

  //     console.log(userInfoJson, "userInfoJson");
  //     // if (userInfoJson.data.token) {
  //     //   updateUserData(userInfoJson.data.token);
  //     // } else {
  //     //   Toast.show({
  //     //     type: 'error',
  //     //     text1: 'Please authorize from my-site by giving confirmations',
  //     //     position: 'bottom',
  //     //     bottomOffset: 80,
  //     //   });
  //     // }
  //   } catch (err) {
  //     // confirm.log(err)
  //     // Toast.show({
  //     //   type: 'error',
  //     //   text1: 'Something went wrong, please try again later',
  //     //   position: 'bottom',
  //     //   bottomOffset: 80,
  //     // });
  //   }
  // };

  // const getAuthStatus = async () => {
  //   const deviceInfo = Device;
  //   const deviceId = Device.osBuildId;
  //   const url = `${AuthApi.QR_AUTH_API}?device_id=${deviceId}`;
  //   console.log(url);
  //   // setLoading(true);
  //   try {
  //     const data = await fetch(url, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         device_info: deviceInfo,
  //         user_id: scannedUserId,
  //         device_id: deviceId,
  //       }),
  //     });

  //     console.log(data, "data");

  //     if (data.ok) {
  //       const dataJson = await data.json();
  //       console.log(dataJson, "data");
  //       // Alert.alert('Please Confirm', dataJson.message, [
  //       //   {
  //       //     text: 'Cancel',
  //       //     // onPress: () => setCameraActive(false),
  //       //   },
  //       //   {
  //       //     text: 'OK',
  //       //     onPress: () => {
  //       //       // setCameraActive(false);
  //       //       // setModalVisible(true);
  //       //     },
  //       //   },
  //       // ]);
  //     } else {
  //       // await data.json();
  //       // Toast.show({
  //       //   type: 'error',
  //       //   text1: 'Something went wrong, please try again',
  //       //   position: 'bottom',
  //       //   bottomOffset: 80,
  //       // });
  //     }
  //   } catch (err) {
  //     // Toast.show({
  //     //   type: 'error',
  //     //   text1:
  //     //     (err as Error).message || 'Something went wrong, please try again',
  //     //   position: 'bottom',
  //     //   bottomOffset: 80,
  //     // });
  //   }
  //   // setLoading(false);
  // };

  // useEffect(() => {
  //   console.log("calling");
  //   if (scannedUserId !== "") {
  //     console.log("calling..........");
  //     getAuthStatus();
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [scannedUserId]);

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
      <CameraView
        style={styles.camera}
        // type={CameraType.back}
        facing="back"
        // onBarcodeScanned={(data) => {
        //   setScannedUserID(data.data);
        //   console.log(data.data);
        //   qrCodeLogin();
        // }}
      >
        <View style={styles.overlay}>
          {/* Scanner Frame */}
          <View style={styles.scannerFrame}>
            <View style={styles.scannerBorder} />
          </View>

          {/* Close Button */}
          <TouchableOpacity
            style={[styles.closeButton, { top: 80, right: 20 }]}
            onPress={() => setCameraVisible(false)}
          >
            <FontAwesome name="times" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>
      </CameraView>
    );
  }

  return (
    <View style={styles.container}>
      {githubLogin ? (
        <Animated.View
        style={[
          styles.modal,
          {
            transform: [{ translateY: modalAnimation }],
            position: "absolute",
            bottom: 0,
            width: "100%",
            height: "100%",
          },
        ]}
      >
        <TouchableOpacity
          style={styles.closeButton}
          onPress={closeModal}
        >
          <FontAwesome name="times" size={24} color="#000" />
        </TouchableOpacity>
        <WebView
          onNavigationStateChange={handleNavigationStateChange}
          source={{
            uri: githubAuthUrl,
          }}
          incognito
          style={{ flex: 1 }}
        />
      </Animated.View>
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
  modal: {
    width: "90%",
    height: "80%",
    borderRadius: 15,
    overflow: "hidden",
    backgroundColor: "#FFF",
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
    backgroundColor: "#E94560",
    borderRadius: 50,
    padding: 5,
    elevation: 5,
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  message: {
    color: "#FFF",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Dimmed background
  },
  scannerFrame: {
    width: 250,
    height: 250,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  scannerBorder: {
    width: "100%",
    height: "100%",
    borderWidth: 2,
    borderColor: "#E94560", // Scanner border color
    borderRadius: 50, // Rounded corners
  },
});
