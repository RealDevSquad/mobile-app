import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const useCheckUserSession = () => {
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('github_token');

        console.log('Stored token:', storedToken);
        if (storedToken) {
          console.log('User already logged in, redirecting to HomeScreen');
          setToken(storedToken);
          router.replace('/HomeScreen');
        }
      } catch (error) {
        console.error('Error checking user session:', error);
      }
    };

    checkUserSession();
  }, [router]);

  return { token };
};

export default useCheckUserSession;