import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';

export default function useCheckUserSession() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const getToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('rds-session');
        setToken(storedToken);
      } catch (error) {
        console.error('Error getting token:', error);
      }
    };

    getToken();
  }, []);

  return { token };
} 