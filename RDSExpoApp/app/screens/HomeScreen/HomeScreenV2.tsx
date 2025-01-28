import React, { useContext, useEffect, useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AuthContext } from '../../../components/context/AuthContext';
import Strings from '../../../components/i18n/en';
import OOOForm from '../../../components/OOO/OOOForm';
import ButtonWidget from '../../../components/src/ButtonWidget';
import LoadingScreen from '../../../components/src/LoadingScreen';
import {
  cancelOoo,
  formatTimeToUnix,
  getUsersStatus,
  submitOOOForm,
} from '../AuthScreen/Util';

const HomeScreenV2 = (): JSX.Element => {
  const currentDate = new Date();
  const tomorrowDate = new Date(currentDate);
  tomorrowDate.setDate(currentDate.getDate() + 1);
  const [isFormVisible, setIsFormVisible] = useState<boolean>(false);
  const [fromDate, setFromDate] = useState<Date>(currentDate);
  const [toDate, setToDate] = useState<Date>(tomorrowDate);
  const [description, setDescription] = useState<string>('');
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { loggedInUserData } = useContext(AuthContext);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  const fetchData = async () => {
    const userStatus = await getUsersStatus(loggedInUserData?.token);
    let capitalizeString =
      userStatus.charAt(0).toUpperCase() + userStatus.substr(1).toLowerCase();
    setStatus(capitalizeString);
  };

  const handleButtonPress = async () => {
    if (status === 'OOO') {
      setIsLoading(true);
      await cancelOoo(loggedInUserData?.token);
      setIsLoading(false);
    } else {
      setIsFormVisible((prev) => !prev);
    }
  };

  const handleFormSubmit = async () => {
    setIsLoading(true); // Set loading state while making API call
    let data = {
      currentStatus: {
        from: formatTimeToUnix(fromDate),
        message: description,
        state: 'OOO',
        until: formatTimeToUnix(toDate),
        updatedAt: formatTimeToUnix(currentDate),
      },
    };
    await submitOOOForm(data, loggedInUserData?.token);
    setDescription('');
    setToDate(tomorrowDate);
    setFromDate(currentDate);
    setIsLoading(false); // Clear loading state after API call
    setIsFormVisible(false); // Hide the form after a successful submission
  };
  const handleBackgroundPress = () => {
    setIsFormVisible(false);
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.text}>You are {status}</Text>
        <View style={{ marginTop: 50 }}>
          <ButtonWidget
            title={
              status === 'Ooo'
                ? Strings.CANCEL_OOO
                : Strings.UPDATE_STATUS_TO_OOO
            }
            onPress={handleButtonPress}
            textColor={'#16A334'}
            style={{ width: '100%' }}
          />
          {isFormVisible && (
            <Modal
              transparent
              visible={isFormVisible}
              // animationType="slide"
              onRequestClose={() => setIsFormVisible(false)}
            >
              <TouchableOpacity
                style={styles.modalContainer}
                activeOpacity={1}
                onPress={handleBackgroundPress}
              >
                <View style={styles.modalContent}>
                  <OOOForm
                    fromDate={fromDate}
                    toDate={toDate}
                    description={description}
                    setToDate={setToDate}
                    setFromDate={setFromDate}
                    setDescription={setDescription}
                    handleFormSubmit={handleFormSubmit}
                    isLoading={isLoading}
                    setIsFormVisible={setIsFormVisible}
                  />
                </View>
              </TouchableOpacity>
            </Modal>
          )}
        </View>
      </View>
      {isLoading && <LoadingScreen />}
    </View>
  );
};

export default HomeScreenV2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'blue',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black background for the blur effect
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
});
