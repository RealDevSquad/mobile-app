import { AuthApi } from '@/api/auth/auth.api';
import { theme } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthProvider';
import { AuthCameraPermission } from '@/modules/auth/AuthCameraPermission';
import { AuthContent } from '@/modules/auth/AuthContent';
import CameraModal from '@/modules/auth/CameraModal';
import GitHubLoginModal from '@/modules/auth/GithubLoginModal';
import { secureStorage } from '@/utils/storage';
import { useFocusEffect } from '@react-navigation/native';
import { Camera } from 'expo-camera';
import * as Device from 'expo-device';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  Easing,
  StyleSheet,
  Text,
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
    () => new Animated.Value(Dimensions.get('window').height)
  );

  const { token, setToken } = useAuth();

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
          router.replace('/(tabs)/home');
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
        router.replace('/(tabs)/home');
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

  useFocusEffect(
    useCallback(() => {
      if (token) {
        router.replace('/(tabs)/home');
      }
    }, [token, router])
  );

  useEffect(() => {
    if (token) {
      router.replace('/(tabs)/home');
    }
  }, [token, router]);

  // Early return to prevent rendering if user is authenticated
  if (token) {
    return null;
  }

  if (cameraVisible) {
    if (!hasPermission) {
      return <AuthCameraPermission />;
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
      <GitHubLoginModal
        visible={githubLogin}
        animation={modalAnimation}
        url={githubAuthUrl}
        onClose={closeModal}
        onNavigationStateChange={handleNavigationStateChange}
      />
      {!githubLogin && (
        <AuthContent
          onGitHubLogin={handleSignIn}
          onWebLogin={handleSignInWithWeb}
        />
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
    backgroundColor: theme.colors.background.primary,
  },
});
