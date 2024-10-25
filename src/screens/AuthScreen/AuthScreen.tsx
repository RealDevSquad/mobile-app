import React, { useContext, useEffect, useState } from 'react';
import DeviceInfo from 'react-native-device-info';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  BackHandler,
  ScrollView,
  StyleSheet,
  Alert,
  Linking,
  Platform,
} from 'react-native';
import Strings from '../../i18n/en';
import { AuthViewStyle } from './styles';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { AuthContext } from '../../context/AuthContext';
import { getUserData, goalsAuth, requestCameraPermission } from './Util';
import { storeData } from '../../utils/dataStore';
import AuthApis from '../../constants/apiConstant/AuthApi';
import { Camera } from 'react-native-camera-kit';
import CustomModal from '../../components/Modal/CustomModal';
import LoadingScreen from '../../components/LoadingScreen';
import Tooltip from 'react-native-walkthrough-tooltip';
import { useSelector } from 'react-redux';
import Images from '../../constants/images/Image';
import GithubSvg from '../../../assets/svgs/github_logo.js';
import WebSvg from '../../../assets/svgs/web';

type RootState = {
  localFeatureFlag: {
    isProdEnvironment: boolean;
  };
};
const baseUrl = AuthApis.GITHUB_AUTH_API;
const AuthScreen = () => {
  const { isProdEnvironment } = useSelector(
    (store: RootState) => store.localFeatureFlag,
  );
  const { setLoggedInUserData, setGoalsData } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [scannedUserId, setScannedUserID] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [toolTip, setToolTip] = useState(false);

  const queryParams = {
    sourceUtm: 'rds-mobile-app',
    redirectURL: 'https://realdevsquad.com/',
  };

  function buildUrl(url: string, params: { [key: string]: string }) {
    const queryString = Object.keys(params)
      .map((key) => `${key}=${params[key]}`)
      .join('&');

    return `${url}?${queryString}`;
  }

  const githubAuthUrl = buildUrl(baseUrl, queryParams);

  useEffect(() => {
    Platform.OS !== 'android' || requestCameraPermission();

    Linking.getInitialURL();
    const handleDeepLink = async (event: { url: string }) => {
      const token = event.url.split('token=')[1];
      token && updateUserData(token); // store token in redux
    };
    const subscription = Linking.addEventListener('url', handleDeepLink);
    return () => {
      subscription.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activateCamera = async () => {
    setCameraActive((prev) => !prev);
    try {
      await requestCameraPermission();
      // Set cameraActive state to true

      const backAction = () => {
        setCameraActive((prev) => !prev);
        Alert.alert('Hold on!', 'Are you sure you want to go back?', [
          {
            text: 'Cancel',
            onPress: () => null,
            style: 'cancel',
          },
          { text: 'YES', onPress: () => BackHandler.exitApp() },
        ]);
        return true;
      };
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );
      return () => backHandler.remove();
    } catch (error: any) {
      Alert.alert('Error requesting camera permission:', error);
    }
  };

  const handleQRCodeScanned = ({ nativeEvent }: any) => {
    setScannedUserID(nativeEvent.codeStringValue);
    setToolTip(true);
  };

  const handleToolTip = () => {
    setTimeout(() => {
      setToolTip(true);
    }, 1000);
    setToolTip(false);
  };
  const handleSignIn = () => {
    Linking.openURL(githubAuthUrl);
  };

  const updateUserData = async (token: string) => {
    try {
      setLoading(true);
      const res = await getUserData(token);
      // this needs to be changed to prod token
      const goals = await goalsAuth('token from prod');
      await storeData('userData', JSON.stringify(res));
      await storeData('userGoalsData', JSON.stringify(goals));
      setLoggedInUserData({
        id: res?.id,
        name: res?.name,
        profileUrl: res?.profileUrl,
        status: res?.status,
        twitter_id: res?.twitter_id,
        linkedin_id: res?.linkedin_id,
        github_id: res?.github_id,
        username: res?.username,
        token: token,
      });
      setGoalsData(goals);
      setLoading(false);
    } catch (err) {
      setLoggedInUserData(null);
    }
  };

  const qrCodeLogin = async () => {
    const deviceId = await DeviceInfo.getUniqueId();

    const url = isProdEnvironment
      ? `${AuthApis.QR_AUTH_API}?device_id=${deviceId}`
      : `${AuthApis.QR_AUTH_API_STAGING}?device_id=${deviceId}`;
    try {
      const userInfo = await fetch(url);
      const userInfoJson = await userInfo.json();
      if (userInfoJson.data.token) {
        updateUserData(userInfoJson.data.token);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Please authorize from my-site by giving confirmations',
          position: 'bottom',
          bottomOffset: 80,
        });
      }
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Something went wrong, please try again later',
        position: 'bottom',
        bottomOffset: 80,
      });
    }
  };

  const getAuthStatus = async () => {
    const deviceInfo = await DeviceInfo.getDeviceName();
    const deviceId = await DeviceInfo.getUniqueId();
    const url = isProdEnvironment
      ? AuthApis.QR_AUTH_API
      : AuthApis.QR_AUTH_API_STAGING;
    setLoading(true);
    try {
      const data = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          device_info: deviceInfo,
          user_id: scannedUserId,
          device_id: deviceId,
        }),
      });

      if (data.ok) {
        const dataJson = await data.json();
        Alert.alert('Please Confirm', dataJson.message, [
          {
            text: 'Cancel',
            onPress: () => setCameraActive(false),
          },
          {
            text: 'OK',
            onPress: () => {
              setCameraActive(false);
              setModalVisible(true);
            },
          },
        ]);
      } else {
        await data.json();
        Toast.show({
          type: 'error',
          text1: 'Something went wrong, please try again',
          position: 'bottom',
          bottomOffset: 80,
        });
      }
    } catch (err) {
      Toast.show({
        type: 'error',
        text1:
          (err as Error).message || 'Something went wrong, please try again',
        position: 'bottom',
        bottomOffset: 80,
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    if (scannedUserId !== '') {
      getAuthStatus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scannedUserId]);

  return (
    <ScrollView contentContainerStyle={AuthViewStyle.container}>
      <View style={[AuthViewStyle.imageContainer]}>
        <Image source={Images.rdsLogo} style={AuthViewStyle.logo} />
      </View>
      <View style={[AuthViewStyle.constContainer]}>
        <Text style={AuthViewStyle.welcomeMsg}>{Strings.WELCOME_TO}</Text>
        <Text style={AuthViewStyle.cmpnyName}>{Strings.REAL_DEV_SQUAD}</Text>
      </View>

      <View style={AuthViewStyle.btnContainer}>
        <TouchableOpacity onPress={handleSignIn} style={AuthViewStyle.btnView}>
          <GithubSvg height={30} width={30} />
          <View style={AuthViewStyle.signInTxtView}>
            <Text style={AuthViewStyle.signInText}>
              {Strings.SIGN_IN_BUTTON_TEXT}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={AuthViewStyle.btnView}
          onPress={activateCamera}
        >
          <WebSvg
            height={40}
            width={40}
            style={{
              marginTop: 13,
              marginLeft: 4,
            }}
          />

          <View style={[AuthViewStyle.signInTxtView, { marginRight: 26 }]}>
            <Text style={AuthViewStyle.signInText}>
              {Strings.SIGN_IN_WITH_WEB}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      {cameraActive && (
        <Camera
          style={StyleSheet.absoluteFill}
          showFrame={true}
          scanBarcode={true}
          onReadCode={handleQRCodeScanned}
          frameColor={'white'}
          laserColor={'white'}
          hideControls
          testID="camera"
        />
      )}

      {cameraActive && (
        <View>
          <Tooltip
            isVisible={toolTip}
            content={
              <Text style={styles.toolTip}>
                Go to `https://my.realdevsquad.com/mobile` & scan QR code to
                login
              </Text>
            }
            placement="top"
            onClose={() => setToolTip(false)}
          >
            <TouchableOpacity onPress={handleToolTip}>
              <Text style={styles.toolButton}>What To Do ? </Text>
            </TouchableOpacity>
          </Tooltip>
        </View>
      )}

      {modalVisible && (
        <CustomModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          qrCodeLogin={qrCodeLogin}
        />
      )}

      {loading && <LoadingScreen />}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  toolTip: {
    color: 'blue',
    fontSize: 14,
    fontWeight: 'bold',
  },
  toolButton: {
    fontSize: 16,
    backgroundColor: '#483d8b',
    color: '#fff',
    borderRadius: 16,
    height: 50,
    padding: 10,
    textAlignVertical: 'center',
    textAlign: 'center',
    margin: 25,
  },
});
export default AuthScreen;
