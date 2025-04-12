import useCheckUserSession from '@/hooks/getUserToken';
import { useUserStore } from '@/store/store';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import StatusUpdateForm from '../../components/StatusUpdateForm';
import { useOOOStore } from '../../store/submitOOOForm';

export default function ProfileScreen() {
  const { loading, fetchUserStatus, userStatus } = useUserStore();
  const { token } = useCheckUserSession(); // Get token
  const { submitOOOForm } = useOOOStore(); // Access the Zustand store function
  const [showForm, setShowForm] = useState(false);

  console.log(userStatus, 'user status');

  useEffect(() => {
    if (token) {
      // Only call fetchUsers and fetchActiveTask when token is available
      fetchUserStatus(token);
    }
  }, [token, fetchUserStatus]);

  const handleFormSubmit = async (fromDate: string, toDate: string, description: string) => {
    console.log('From Date:', fromDate);
    console.log('To Date:', toDate);
    console.log('Description:', description);

    const formData = {
      fromDate,
      toDate,
      description,
    };

    try {
      // Call the submitOOOForm function from Zustand store
      const response = await submitOOOForm(formData, token);
      if (response) {
        Alert.alert('Success', 'Your status has been updated to OOO.');
        fetchUserStatus(token); // Refresh the user status
        setShowForm(false); // Close the form
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update your status. Please try again.');
      console.error('Error submitting OOO form:', error);
    }
  };

  if (!token || loading) {
    // Show loading indicator while token or store is loading
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#2819b2" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!showForm && (
        <>
          <Text style={[styles.title, styles.highlight]}>
            You are {userStatus?.data?.currentStatus?.state}
          </Text>
          <TouchableOpacity style={styles.button} onPress={() => setShowForm(true)}>
            <Text style={styles.buttonText}>Update your status</Text>
          </TouchableOpacity>
        </>
      )}

      {showForm && (
        <StatusUpdateForm
          onSubmit={handleFormSubmit}
          onClose={() => setShowForm(false)}
        />
      )}
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
  highlight: {
    color: '#2819b2',
  },
  button: {
    borderWidth: 2,
    borderColor: 'green',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'green',
    fontSize: 16,
    fontWeight: 'bold',
  },
});