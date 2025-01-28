import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

const data = [
  { label: ' Available', value: '1' },
  { label: 'Assigned', value: '2' },
  { label: 'In Progress', value: '3' },
  { label: 'Block', value: '4' },
  { label: 'Smock testimng', value: '5' },
  { label: 'compleated', value: '6' },
  { label: 'Needs Review', value: '7' },
  { label: 'In review', value: '8' },
];

const DropdownComponent = () => {
  const [value, setValue] = useState('');

  return (
    <Dropdown
      style={styles.dropdown}
      placeholderStyle={styles.placeholderStyle}
      selectedTextStyle={styles.selectedTextStyle}
      inputSearchStyle={styles.inputSearchStyle}
      data={data}
      maxHeight={300}
      labelField="label"
      valueField="value"
      placeholder="Select item"
      value={value}
      onChange={(item) => {
        setValue(item.value);
      }}
    />
  );
};

export default DropdownComponent;

const styles = StyleSheet.create({
  dropdown: {
    width: '100%',
    height: 50,
    elevation: 5,
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: '#6f9ee6',
    marginTop: 10,
    paddingLeft: 15,
    paddingRight: 15,
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
    textShadowColor: 'Blue',
  },

  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },

  label: {
    position: 'absolute',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
});
