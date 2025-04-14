import StatusUpdateForm from '@/components/statusUpdateForm';
import useCheckUserSession from '@/hooks/getUserToken';
import { useUserStore } from '@/store/store'; // Use useUserStore to access submitOOOForm and cancelOOO
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {
  const { fetchUserStatus, userStatus, submitOOOForm, cancelOOO } = useUserStore(); // Access Zustand store functions
  const { token } = useCheckUserSession(); // Get token
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Track loading state for cancel OOO

  console.log(userStatus, 'user status');

  useEffect(() => {
    if (token) {
      fetchUserStatus(token); // Fetch user status when token is available
    }
  }, [token, fetchUserStatus]);

  const handleCancelOOO = async () => {
    if (!token) return; // Ensure token is not null
    setIsLoading(true); // Set loading state
    try {
      await cancelOOO(token); // Call cancelOOO function from Zustand store
      Alert.alert('Success', 'Your status has been updated to ACTIVE.');
      fetchUserStatus(token); // Refresh the user status
    } catch (error) {
      Alert.alert('Error', 'Failed to cancel your OOO status. Please try again.');
      console.error('Error cancelling OOO status:', error);
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  const handleFormSubmit = async (fromDate: Date, toDate: Date, description: string) => {
    if (!token) return; // Ensure token is not null

    // Format the dates as strings (if needed by the API)
    const formData = {
      fromDate: fromDate.toISOString(), // Convert Date to ISO string
      toDate: toDate.toISOString(), // Convert Date to ISO string
      description,
    };

    try {
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

  return (
    <View style={styles.container}>
      {!showForm && (
        <>
          <Text style={[styles.title, styles.highlight]}>
            You are currently {userStatus?.data?.currentStatus?.state}
          </Text>
          {userStatus?.data?.currentStatus?.state === 'OOO' ? (
            <TouchableOpacity
              style={styles.button}
              onPress={handleCancelOOO}
              disabled={isLoading} // Disable button while loading
            >
              <Text style={styles.buttonText}>
                {isLoading ? 'Cancelling...' : 'Cancel OOO'}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.button} onPress={() => setShowForm(true)}>
              <Text style={styles.buttonText}>Submit OOO</Text>
            </TouchableOpacity>
          )}
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