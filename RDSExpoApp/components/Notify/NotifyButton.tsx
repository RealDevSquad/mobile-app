import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { NotifyType } from './NotifyType';

const NotifyButton = ({
  onPress,
  title,
  buttonStyle,
  textStyle,
}: NotifyType) => {
  return (
    <TouchableOpacity style={[styles.button, buttonStyle]} onPress={onPress}>
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 16,
  },
});

export default NotifyButton;
