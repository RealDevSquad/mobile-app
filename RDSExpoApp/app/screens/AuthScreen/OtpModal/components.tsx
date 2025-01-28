import React from 'react';
import { Text, View } from 'react-native';
import OtpModalStyle from './styles';

type OtpBoxProps = {
  index: number;
  code: string;
  maxLength: number;
  textInputFocus: boolean;
};

export function OtpBox({
  index,
  code,
  maxLength,
  textInputFocus,
}: OtpBoxProps) {
  const isCurrentValue = index === code.length;
  const isLastValue = index === maxLength - 1;
  const isCodeComplete = code.length === maxLength;
  const isValueFocused = isCurrentValue || (isLastValue && isCodeComplete);
  return (
    <View
      style={[
        OtpModalStyle.otpBox,
        textInputFocus && isValueFocused ? OtpModalStyle.otpBoxFocused : {},
      ]}
      key={index}
    >
      <Text style={OtpModalStyle.otp}>{code[index] ? code[index] : ''}</Text>
    </View>
  );
}
