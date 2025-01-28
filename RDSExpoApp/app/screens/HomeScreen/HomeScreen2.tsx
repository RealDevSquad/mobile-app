import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Strings from '../../../components/i18n/en';
import OOOForm from '../../../components/OOO/OOOForm';

const HomeScreen2 = (): JSX.Element => {
  const [isFormVisible, setIsFormVisible] = useState<boolean>(false);
  const [fromDate, setFromDate] = useState<number>(Date.now());
  const [toDate, setToDate] = useState<number>(Date.now());
  const [description, setDescription] = useState<string>('');

  const handleButtonPress = () => {
    setIsFormVisible((prev) => !prev);
  };

  const handleFormSubmit = () => {
    // patch api call (it should give loading , failed, error and success messages)
    console.log(fromDate, toDate, description); // was giving lint issues, after api call please remove this log
    setIsFormVisible((prev) => !prev);
  };

  return (
    <View>
      <Text style={styles.textWelcome}>Welcome to my app!</Text>
      <Text style={styles.textStatus}>You are Idle</Text>

      <TouchableOpacity
        onPress={handleButtonPress}
        style={styles.StatusButtonContainer}
      >
        <Text style={styles.StatusButtonText}>
          {Strings.UPDATE_STATUS_TO_OOO}
        </Text>
      </TouchableOpacity>
      {isFormVisible && (
        <Modal animationType="fade" transparent={true}>
          <OOOForm
            fromDate={fromDate}
            toDate={toDate}
            description={description}
            setToDate={setToDate}
            setFromDate={setFromDate}
            setDescription={setDescription}
            handleFormSubmit={handleFormSubmit}
          />
        </Modal>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  StatusButtonContainer: {
    backgroundColor: 'white',
    borderRadius: 5,
    paddingVertical: 12,
    paddingHorizontal: 12,
    width: '50%',
    marginLeft: 'auto',
    marginRight: 'auto',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#80217f',
    marginTop: 35,
  },
  StatusButtonText: {
    color: '#80217f',
  },
  textStatus: {
    marginLeft: 'auto',
    marginRight: 'auto',
    fontSize: 32,
    marginBottom: 70,
    color: '#0034a5',
  },
  textWelcome: {
    marginBottom: 140,
    marginLeft: 'auto',
    marginRight: 'auto',
    fontSize: 40,
    marginTop: 35,
    color: '#000000',
  },
});
export default HomeScreen2;
