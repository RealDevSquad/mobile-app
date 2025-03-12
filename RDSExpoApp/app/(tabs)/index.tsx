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

  const githubAuthUrl = buildUrl(
    AuthApi.GITHUB_AUTH_API,
    queryParams,
  );

  const handleTokenFromUrl = async (url: string) => {
    try {
      const urlObj = new URL(url);
      const token = urlObj.searchParams.get('token');
      if (token) {
        await AsyncStorage.setItem('github_token', token);
        console.log('Token stored:', token);
        router.push('/ProfileScreen');
      }
    } catch (error) {
      console.error('Error processing deep link', error);
    }
  };

  useEffect(() => {
    (async () => {
      const initialUrl = await Linking.getInitialURL();
      console.log("Initial URL received:", initialUrl);
      if (initialUrl) {
        handleTokenFromUrl(initialUrl);
      }
    })();

    const subscription = Linking.addEventListener('url', (event) => {
      console.log("Deep link event received:", event.url);
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
      <TouchableOpacity style={styles.button} onPress={handleSignIn}>
        <Text style={styles.buttonText}>Sign in with GitHub</Text>
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
    marginTop:-150,
  },
  title: {
    fontSize: 29,
    marginBottom: 6,
    marginTop: 50 ,
    color: '#fff',
    
  },
  title1: {
    fontSize: 34,
    marginBottom: 50,
    fontWeight: 'bold' ,
    color: '#fff',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 7,
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingVertical:12,
    paddingHorizontal: 18
  },
  buttonText: {
    color: '#000',
    marginLeft: 10,
    fontSize: 20,
    fontWeight: 'bold'
  },
});