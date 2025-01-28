import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useContext, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { Tabs } from 'react-native-collapsible-tab-view';
import { ImagePickerResponse } from 'react-native-image-picker';
import Modal from 'react-native-modal';
import { AuthContext } from '../../../components/context/AuthContext';
import Avatar from '../../../components/src/Avatar';
import EllipseComponent from '../../../components/src/EllipseComponent';
import { profileScreenStyles } from './styles';
import ActiveScreen from './TaskScreens/ActiveTask';
import All from './TaskScreens/All';
import UserData from './User Data/UserData';

const ProfileHeader = () => {
  const [response] = useState<ImagePickerResponse>({});
  const { loggedInUserData, setLoggedInUserData } = useContext(AuthContext);
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  const handleDropdown = () => {
    setDropdownVisible((prev) => !prev);
  };

  const showDefaultAvatar = () => {
    if (response?.assets) {
      return false;
    }
    return true;
  };

  const handleLogout = () => {
    setLoggedInUserData(null);
    AsyncStorage.removeItem('userData');
  };

  return (
    <View pointerEvents="box-none">
      <View style={styles.container}>
        <TouchableOpacity style={styles.optionsButton} onPress={handleDropdown}>
          <Text style={styles.verticalEllipse}>...</Text>
        </TouchableOpacity>
      </View>
      {isDropdownVisible && (
        <Modal
          isVisible={isDropdownVisible}
          onBackdropPress={handleDropdown}
          onBackButtonPress={handleDropdown}
          backdropOpacity={0.7}
          animationIn="slideInUp"
          animationOut="slideOutDown"
          style={profileScreenStyles.modal}
        >
          <EllipseComponent
            handleLogout={handleLogout}
            handleDropDown={handleDropdown}
          />
        </Modal>
      )}
      <TouchableWithoutFeedback
        style={profileScreenStyles.mainview}
        onPress={handleDropdown}
      >
        <>
          {response?.assets &&
            response.assets.map(({ uri }) => (
              <Avatar key={uri} uri={uri || ''} size={100} />
            ))}
          {showDefaultAvatar() && (
            <Avatar uri={loggedInUserData?.profileUrl || ''} size={100} />
          )}
          <View style={profileScreenStyles.titleText} pointerEvents="box-none">
            <UserData userData={loggedInUserData} />
          </View>
        </>
      </TouchableWithoutFeedback>
    </View>
  );
};

const ProfileScreen: React.FC = () => {
  return (
    <Tabs.Container renderHeader={ProfileHeader}>
      <Tabs.Tab name="Active" key="2">
        <Tabs.ScrollView>
          <ActiveScreen />
        </Tabs.ScrollView>
      </Tabs.Tab>
      <Tabs.Tab name="All" key="1">
        <Tabs.ScrollView>
          <All />
        </Tabs.ScrollView>
      </Tabs.Tab>
    </Tabs.Container>
  );
};

export default ProfileScreen;
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  optionsButton: {
    padding: 4,
  },
  verticalEllipse: {
    color: 'black',
    fontSize: 24,
    marginTop: 4,
    fontWeight: 'bold',
    transform: [{ rotate: '90deg' }],
  },
});
