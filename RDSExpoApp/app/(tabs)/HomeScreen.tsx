import useCheckUserSession from '@/hooks/getUserToken';
import { useUserStore } from '@/store/store';
import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

export default function ProfileScreen() {
  const { loading,fetchUserStatus,userStatus } = useUserStore();
  const { token } = useCheckUserSession(); // Get token


console.log(userStatus,"user status")

    useEffect(() => {
      if (token) { // Only call fetchUsers and fetchActiveTask when token is available
        fetchUserStatus(token);
      }
    }, [token, fetchUserStatus ]);
  
    if (!token || loading) { // Show loading indicator while token or store is loading
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Loading...</Text>
        </View>
      );
    }
  
  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}>Home Screen</Text> */}
      <Text style={styles.title}>You are currently active {userStatus?.data?.currentStatus?.state}</Text>
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
