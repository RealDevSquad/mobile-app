import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

const EllipseComponent = ({
  handleLogout,
  handleDropDown,
}: {
  handleLogout: () => void;
  handleDropDown: () => void;
}) => {
  const dispatch = useDispatch();
  const { isProdEnvironment } = useSelector((store) => store.localFeatureFlag);
  return (
    <View style={styles.dropdownContainer}>
      <TouchableOpacity onPress={handleLogout}>
        <Text style={styles.dropdownOption}>Logout</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          isProdEnvironment
            ? dispatch({ type: 'DEV' })
            : dispatch({ type: 'PROD' });
          handleDropDown();
        }}
      >
        <Text style={[styles.dropdownOption, { color: 'black' }]}>
          {!isProdEnvironment ? 'Prod mode' : 'Dev mode'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  flexContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionsButton: {
    flex: 1,
    padding: 4,
    alignItems: 'flex-end',
  },
  verticalEllipse: {
    color: 'black',
    fontSize: 24,
    fontWeight: 'bold',
    transform: [{ rotate: '90deg' }],
    padding: 8,
  },
  dropdownContainer: {
    position: 'absolute',
    top: 10, // Adjust the top position according to your layout
    right: 10,
    backgroundColor: 'white',
    borderRadius: 5,
    elevation: 5,
    padding: 10,
  },
  dropdownOption: {
    fontSize: 18,
    paddingVertical: 8,
    color: 'red',
  },
  closeContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  closeButton: {
    fontSize: 18,
    color: 'black',
    padding: 2,
  },
  close: {
    height: 20,
    width: 20,
  },
});

export default EllipseComponent;
