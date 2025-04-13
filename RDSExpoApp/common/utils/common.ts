import AsyncStorage from '@react-native-async-storage/async-storage';

export const formatDateTime = (timestamp: string | number): string => {
    if (!timestamp) return "Invalid date";
  
    // Convert the timestamp to a number if it's a string
    let numericTimestamp = Number(timestamp);
  
    // Check if the timestamp is in seconds (10 digits) and convert to milliseconds
    if (numericTimestamp < 1000000000000) {
      numericTimestamp *= 1000;
    }
  
    const date = new Date(numericTimestamp);
  
    // Format the date only
    const formattedDate = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  
    return formattedDate;
  };




// Function to get a value from local storage
export const getLocalStorageItem = async (key: string): Promise<string | null> => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value; // Return the value
  } catch (error) {
    console.error(`Error getting item with key "${key}":`, error);
    return null;
  }
};

// Function to set a value in local storage
export const setLocalStorageItem = async (key: string, value: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.error(`Error setting item with key "${key}":`, error);
  }
};

export const removeLocalStorageItem = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing item with key "${key}":`, error);
  }
};