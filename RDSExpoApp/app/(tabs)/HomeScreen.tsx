import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('github_token');
      console.log('Token in AsyncStorage:', token); // Verify token in AsyncStorage
    };

    checkToken();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});