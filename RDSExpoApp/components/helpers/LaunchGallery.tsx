import {
  ImagePickerResponse,
  launchImageLibrary,
} from 'react-native-image-picker';

const uploadImage = (
  setResponse: (res: ImagePickerResponse) => void,
  closeModal: () => void,
) => {
  launchImageLibrary(
    {
      quality: 0.5,
      maxWidth: 400,
      maxHeight: 400,
      mediaType: 'photo',
    },
    (res) => {
      setResponse(res);
    },
  );
  closeModal();
};

export default uploadImage;
