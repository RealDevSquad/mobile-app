import { AuthApi } from '@/api/auth/auth.api';
import CameraModal from '@/components/Modal/CameraModal';
import GitHubLoginModal from '@/components/Modal/GithubLoginModal';
import { theme } from '@/constants/theme';
import { useAuthActions, useAuthToken } from '@/store/authStore';
import { secureStorage } from '@/utils/secureStorage';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Camera } from 'expo-camera';
import * as Device from 'expo-device';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';

import { Image } from 'expo-image';
import {
  Alert,
  Animated,
  Dimensions,
  Easing,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ToastManager, { Toast } from 'toastify-react-native';

const toastConfig = {
  success: (props: { text1: string; text2?: string }) => (
    <View style={{ backgroundColor: '#4CAF50', padding: 16, borderRadius: 10 }}>
      <Text style={{ color: 'white', fontWeight: 'bold' }}>{props.text1}</Text>
      {props.text2 && <Text style={{ color: 'white' }}>{props.text2}</Text>}
    </View>
  ),
  // Override other toast types as needed
};

function buildUrl(url: string, params: { [key: string]: string }) {
  const queryString = Object.keys(params)
    .map((key) => `${key}=${encodeURIComponent(params[key])}`)
    .join('&');
  return `${url}?${queryString}`;
}

const AuthScreen = () => {
  const router = useRouter();
  const [modalAnimation] = useState(
    new Animated.Value(Dimensions.get('window').height)
  );

  const token = useAuthToken();
  const { setToken } = useAuthActions();

  const [githubLogin, setGithubLogin] = useState(false);
  const [cameraVisible, setCameraVisible] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [scannedUserId, setScannedUserId] = useState('');
  const [showModal, setShowModal] = useState(false);

  const openModal = useCallback(() => {
    Animated.timing(modalAnimation, {
      toValue: Dimensions.get('window').height * 0.2, // Adjust the final position
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [modalAnimation]);

  const closeModal = () => {
    Animated.timing(modalAnimation, {
      toValue: Dimensions.get('window').height, // Move back off-screen
      duration: 300,
      easing: Easing.in(Easing.ease),
      useNativeDriver: false,
    }).start(() => setGithubLogin(false));
  };

  useEffect(() => {
    if (githubLogin) {
      openModal();
    }
  }, [githubLogin, openModal]);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const queryParams = {
    sourceUtm: 'rds-mobile-app',
    redirectURL: 'rdsapp://auth',
  };

  const githubAuthUrl = buildUrl(
    'https://staging-api.realdevsquad.com/auth/github/login',
    queryParams
  );
  const handleNavigationStateChange = async (navState: any) => {
    if (navState.url.includes('token=')) {
      try {
        const urlObj = new URL(navState.url);
        const token = urlObj.searchParams.get('token');
        if (token) {
          // Store token securely and update auth store
          await secureStorage.setItem('auth_token', token);
          setToken(token);
          setGithubLogin(false);
          router.replace('/home');
        }
      } catch (error) {
        console.error('Error parsing URL or saving token:', error);
        // Show error to user
        Toast.show({
          type: 'error',
          text1: 'Login failed',
          text2: 'Unable to save authentication token',
          position: 'bottom',
          bottomOffset: 80,
        });
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
    try {
      const userInfoJson = await AuthApi.qrCodeAuth.fn(deviceId || '');
      if (userInfoJson.data.token) {
        // Store token securely and update auth store
        await secureStorage.setItem('auth_token', userInfoJson.data.token);
        setToken(userInfoJson.data.token);
        setCameraVisible(false);
        router.replace('/home');
      } else {
        Toast.show({
          type: 'error',
          text1: 'Please authorize from my-site by giving confirmations',
          position: 'bottom',
          bottomOffset: 80,
        });
        setScannedUserId('');
      }
    } catch (err) {
      console.error('Error during QR code login:', err);
      Toast.show({
        type: 'error',
        text1: 'Something went wrong, please try again later',
        position: 'bottom',
        bottomOffset: 80,
      });
    }
  };

  const getAuthStatus = useCallback(async () => {
    const deviceInfo = Device.modelName;
    const deviceId = Device.osBuildId;
    try {
      const dataJson = await AuthApi.qrCodeAuthPost.fn({
        device_info: deviceInfo || '',
        user_id: scannedUserId,
        device_id: deviceId || '',
      });

      Alert.alert('Please Confirm', dataJson.message, [
        {
          text: 'Cancel',
          onPress: () => {
            setCameraVisible(false);
            setScannedUserId('');
          },
        },
        {
          text: 'OK',
          onPress: () => {
            setShowModal(true);
          },
        },
      ]);
    } catch (err) {
      Toast.show({
        type: 'error',
        text1:
          (err as Error).message || 'Something went wrong, please try again',
        position: 'bottom',
        bottomOffset: 80,
      });
    }
  }, [scannedUserId]);

  useEffect(() => {
    if (scannedUserId !== '') {
      getAuthStatus();
    }
  }, [scannedUserId, getAuthStatus]);

  useEffect(() => {
    if (token) {
      router.replace('/home');
    }
  }, [token, router]);

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
    );
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
            source={require('../../assets/images/rdsLogo.png')}
            style={styles.logo}
            contentFit="contain"
            placeholder="blurhash"
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
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.gray[900],
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: theme.spacing.lg,
  },
  title: {
    fontSize: theme.typography.fontSize['3xl'],
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.primary[500],
    marginBottom: 5,
  },
  title1: {
    fontSize: theme.typography.fontSize['4xl'],
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.inverted,
    marginBottom: theme.spacing['2xl'],
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.radius.sm,
    marginBottom: theme.spacing.md,
    width: 250,
    ...theme.shadow.lg,
  },
  githubButton: {
    backgroundColor: theme.colors.gray[800],
  },
  webButton: {
    backgroundColor: theme.colors.primary[500],
  },
  buttonText: {
    color: theme.colors.text.inverted,
    fontSize: theme.typography.fontSize.lg,
    fontFamily: theme.typography.fontFamily.medium,
    marginLeft: theme.spacing.sm,
  },
  message: {
    color: theme.colors.text.inverted,
    fontSize: theme.typography.fontSize.base,
    fontFamily: theme.typography.fontFamily.regular,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
});
