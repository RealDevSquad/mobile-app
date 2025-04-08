import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';

export default function useCheckUserSession() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const getToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('github_token');
        setToken(storedToken); // Set the token once retrieved
      } catch (error) {
        console.error('Error getting token:', error);
      }
    };

    getToken();
  }, []);
  return { token }; // Only return the token
}