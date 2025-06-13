import StatusUpdateForm from "@/components/StatusUpdateForm";
import useCheckUserSession from "@/hooks/getUserToken";
import { useUserStore } from "@/store/store"; // Use useUserStore to access submitOOOForm and cancelOOO
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ProfileScreen() {
  const { fetchUserStatus, userStatus, submitOOOForm, cancelOOO, loading } =
    useUserStore(); // Access Zustand store functions
  const { token } = useCheckUserSession(); // Get token
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Track loading state for cancel OOO

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
      Alert.alert("Success", "Your status has been updated to ACTIVE.");
      fetchUserStatus(token); // Refresh the user status
    } catch (error) {
      Alert.alert(
        "Error",
        "Failed to cancel your OOO status. Please try again."
      );
      console.error("Error cancelling OOO status:", error);
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  const handleFormSubmit = async (
    fromDate: Date,
    toDate: Date,
    description: string
  ) => {
    if (!token) return; // Ensure token is not null

    // Format the dates as strings (if needed by the API)
    const formData = {
      fromDate: fromDate.toISOString(), // Convert Date to ISO string
      toDate: toDate.toISOString(), // Convert Date to ISO string
      description,
    };

    try {
      await submitOOOForm(formData, token);
      Alert.alert("Success", "Your status has been updated to OOO.");
      fetchUserStatus(token); // Refresh the user status
      setShowForm(false); // Close the form
    } catch (error) {
      Alert.alert("Error", "Failed to update your status. Please try again.");
      console.error("Error submitting OOO form:", error);
    }
  };

  if (!token || loading) {
    // Show loading indicator while token or store is loading
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!showForm && (
        <>
          <Text style={styles.title}>
            You are currently{" "}
            <Text style={styles.highlight}>
              {userStatus?.data?.currentStatus?.state || "UNKNOWN"}
            </Text>
          </Text>
          {userStatus?.data?.currentStatus?.state === "OOO" ? (
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleCancelOOO}
              disabled={isLoading} // Disable button while loading
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" testID="loading-indicator" />
              ) : (
                <Text style={styles.buttonText}>Cancel OOO</Text>
              )}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.button, styles.submitButton]}
              onPress={() => setShowForm(true)}
            >
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
    backgroundColor: "#f5f5f5",
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  highlight: {
    color: "#4CAF50",
    fontWeight: "bold",
  },
  button: {
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    width: "60%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    marginTop: 20,
  },
  submitButton: {
    backgroundColor: "#4CAF50",
  },
  cancelButton: {
    backgroundColor: "#FF5722",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
