import AsyncStorage from '@react-native-async-storage/async-storage';
import EncryptedStorage from 'react-native-encrypted-storage';
import Toast from 'react-native-toast-message/lib/src/Toast';

export const storeData = async (name: string, value: string) => {
  try {
    await AsyncStorage.setItem(name, value);
  } catch (err) {
    console.log(err);
  }
};

export const getData = async (item: string) => {
  console.log('getData', item);
  return AsyncStorage.getItem(item)
    .then((res) => {
      return res ? JSON.parse(res) : '';
    })
    .catch((err) => console.log(err));
};

export enum StorageKey {
  TOKEN = 'TOKEN',
}

export const Storage = {
  async setItem(key: string, value: string): Promise<void> {
    await EncryptedStorage.setItem(key, value.toString());
  },

  async getItem(key: string): Promise<string | null> {
    return EncryptedStorage.getItem(key);
  },

  async deleteItem(key: string): Promise<void> {
    try {
      await EncryptedStorage.removeItem(key);
    } catch (error: any) {
      // There was an error on the native side
      // You can find out more about this error by using the `error.code` property
      console.log(error.code); // ex: -25300 (errSecItemNotFound)
      Toast.show({
        type: 'error',
        text1: error.code,
        position: 'bottom',
        bottomOffset: 80,
      });
    }
  },

  async clearStorage(): Promise<void> {
    try {
      await EncryptedStorage.clear();
      // Congrats! You've just cleared the device storage!
    } catch (error: any) {
      // There was an error on the native side
      Toast.show({
        type: 'error',
        text1: error.code,
        position: 'bottom',
        bottomOffset: 80,
      });
    }
  },
};

export const removeDataFromAsyncStorage = async (key: String) => {
  try {
    await AsyncStorage.removeItem(key);
    console.log(`Data with key ${key} removed successfully.`);
  } catch (error) {
    console.error(`Error removing data with key ${key}: ${error.message}`);
  }
};


export default storeData;