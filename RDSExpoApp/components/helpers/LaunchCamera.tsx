import { PermissionsAndroid, Platform } from 'react-native';
import { ImagePickerResponse, launchCamera } from 'react-native-image-picker';
import Toast from 'react-native-toast-message';
import Strings from '../i18n/en';

const takePicture = async (
  setResponse: (res: ImagePickerResponse) => void,
  closeModal: () => void,
) => {
  try {
    if (Platform.OS === 'ios') {
      launchCamera(
        {
          saveToPhotos: true,
          mediaType: 'photo',
          includeBase64: false,
        },
        setResponse,
      );
    }

    let granted;
    if (Platform.OS === 'android') {
      granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'App Camera Permission',
          message: 'App needs access to your camera ',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        launchCamera(
          {
            quality: 0.5,
            maxWidth: 400,
            maxHeight: 400,
            mediaType: 'photo',
            saveToPhotos: false,
          },
          setResponse,
        );
      } else {
        Toast.show({
          type: 'error',
          text1: Strings.Permissin_Denied_Head,
          text2: Strings.Permission_Denied_Text,
          position: 'bottom',
          bottomOffset: 80,
        });
      }
    }
    closeModal();
  } catch (err) {
    console.warn(err);
    closeModal();
  }
};

export default takePicture;
