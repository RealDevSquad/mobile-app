import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import useUserStore from '../../constants/stores/UserStore'; // Import Zustand store

export default function HomeScreen() {
  const userState = useUserStore((state) => state.userState); // Get user state from Zustand
  const fetchUserState = useUserStore((state) => state.fetchUserState); // Zustand fetchUserState function

  useEffect(() => {
    fetchUserState(); // Fetch user state when the screen loads
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home Screen</Text>
      <Text style={styles.status}>
        Status: {userState ? userState : 'Loading...'} {/* Display user state */}
      </Text>
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
  status: {
    fontSize: 16,
    marginTop: 10,
  },
});