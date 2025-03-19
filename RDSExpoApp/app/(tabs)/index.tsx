import FontAwesome from '@expo/vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import {
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AuthApi from '../../constants/apiConstant/AuthApi';

function buildUrl(url: string, params: { [key: string]: string }) {
  const queryString = Object.keys(params)
    .map(key => `${key}=${encodeURIComponent(params[key])}`)
    .join('&');
  return `${url}?${queryString}`;
}

const AuthScreen = () => {
  const router = useRouter();

  const queryParams = {
    sourceUtm: 'rds-mobile-app',
    redirectURL: 'rdsapp://auth',
  };

  const githubAuthUrl = buildUrl(AuthApi.GITHUB_AUTH_API, queryParams);

  const checkUserSession = async () => {
    const token = await AsyncStorage.getItem('github_token');
    if (token) {
      console.log('User already logged in, redirecting to HomeScreen');
      router.replace('/HomeScreen');
    }
  };

  const handleTokenFromUrl = async (url: string) => {
    try {
      const urlObj = new URL(url);
      const token = urlObj.searchParams.get('token');
      if (token) {
        await AsyncStorage.setItem('github_token', token);
        console.log('Token stored:', token);
        router.replace('/HomeScreen');
      }
    } catch (error) {
      console.error('Error processing deep link', error);
    }
  };

  useEffect(() => {
    checkUserSession();

    (async () => {
      const initialUrl = await Linking.getInitialURL();
      console.log('Initial URL received:', initialUrl);
      if (initialUrl) {
        handleTokenFromUrl(initialUrl);
      }
    })();

    const subscription = Linking.addEventListener('url', (event) => {
      console.log('Deep link event received:', event.url);
      handleTokenFromUrl(event.url);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const handleSignIn = () => {
    Linking.openURL(githubAuthUrl).catch(err =>
      console.error('Failed to open GitHub auth URL', err),
    );
  };

  return (
    <View style={styles.container}>
      <Image 
        source={require('../../assets/images/rdsLogo.png')} 
        style={styles.logo} 
        resizeMode="contain" 
      />
      <Text style={styles.title}>Welcome to</Text>
      <Text style={styles.title1}>REAL DEV SQUAD</Text>

      <TouchableOpacity style={[styles.button, { borderRadius: 12 }]} onPress={handleSignIn}>
        <FontAwesome name="github" size={24} color="#000" style={styles.icon} />
        <Text style={styles.buttonText}>GitHub SignIn</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, { borderRadius: 12, marginTop: 20 }]} onPress={handleSignIn}>
        <FontAwesome name="globe" size={24} color="#000" style={styles.icon} />
        <Text style={styles.buttonText}>Web SignIn</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AuthScreen;

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2818b6',
  },
  logo: {
    width: 280,
    height: 220,
    marginTop: -90,
  },
  title: {
    fontSize: 29,
    marginBottom: 6,
    marginTop: 50,
    color: '#fff',
  },
  title1: {
    fontSize: 34,
    marginBottom: 100,
    fontWeight: 'bold',
    color: '#fff',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 7,
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingVertical: 12,
    paddingHorizontal: 18,
  },
  icon: {
    marginRight: 10,
  },
  buttonText: {
    color: '#000',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
