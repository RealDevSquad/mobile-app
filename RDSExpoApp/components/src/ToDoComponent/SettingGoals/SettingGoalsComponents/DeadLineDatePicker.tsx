import React, { useState } from 'react';
import { Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import DatePicker from 'react-native-date-picker';
import { scale } from '../../../../utils/utils';
import StyleConfig from '../../../../utils/StyleConfig';

const DeadLineDatePicker = ({ date, setDate }) => {
  const [open, setOpen] = useState(false);

  const isToday = (someDate) => {
    const today = new Date();
    return (
      someDate.getDate() === today.getDate() &&
      someDate.getMonth() === today.getMonth() &&
      someDate.getFullYear() === today.getFullYear()
    );
  };

  return (
    <ScrollView>
      <TouchableOpacity
        style={styles.buttonStyle}
        onPress={() => setOpen(true)}
      >
        <Text style={styles.buttonTextStyle}>
          {isToday(date) ? 'Pick date' : date.toDateString()}
        </Text>
      </TouchableOpacity>
      <DatePicker
        modal
        mode="date"
        open={open}
        date={date}
        onConfirm={(selectedDate) => {
          setOpen(false);
          setDate(selectedDate);
        }}
        onCancel={() => {
          setOpen(false);
        }}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  buttonStyle: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    padding: scale(10),
    borderRadius: 8,
    backgroundColor: StyleConfig.colors.whiteInput,
    fontSize: scale(12),
    borderWidth: 0.5,
    color: StyleConfig.colors.darkGrey,
  },
  buttonTextStyle: {
    justifyContent: 'center',
    color: StyleConfig.colors.greyLabel,
  },
});

export default DeadLineDatePicker;
