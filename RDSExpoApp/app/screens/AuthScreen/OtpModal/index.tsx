import React, { useRef, useState } from 'react';
import {
  Keyboard,
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import Strings from '../../../../components/i18n/en';
import { isValidTextInput } from '../Util';
import { OtpBox } from './components';
import OtpModalStyle from './styles';

type OtpModalProps = {
  code: string;
  maxLength: 4 | 6;
  testId: string;
  title: string;
  visible: boolean;
  setCode: (code: string) => void;
  closeModal: () => void;
};

export function OtpModal({
  testId,
  code,
  title,
  visible,
  maxLength,
  setCode,
  closeModal,
}: OtpModalProps) {
  const [textInputFocus, setTextInputFocus] = useState<boolean>(false);
  const textInputRef = useRef<TextInput>(null);
  const onTextInput = () => {
    setTextInputFocus(true);
    textInputRef.current?.focus();
  };
  const ontextInputBlur = () => setTextInputFocus(false);
  const onRequestClose = () => {
    Keyboard.dismiss;
    setTextInputFocus(false);
    closeModal();
  };
  const isOtpReady = Boolean(code.length === maxLength);
  //TODO: fix layout shift on text input click event
  return (
    <Modal
      transparent
      testID={testId}
      visible={visible}
      animationType="slide"
      onRequestClose={onRequestClose}
    >
      <Pressable
        style={[OtpModalStyle.container, OtpModalStyle.backdrop]}
        onPress={onRequestClose}
      >
        <View style={OtpModalStyle.centeredWrapper}>
          <Text style={OtpModalStyle.title}>{title}</Text>
          <View style={OtpModalStyle.relativeWrapper}>
            <Pressable
              style={OtpModalStyle.otpBoxesWrapper}
              onPress={onTextInput}
            >
              {Array.from({ length: maxLength }, (_, index) => (
                <OtpBox
                  index={index}
                  code={code}
                  maxLength={maxLength}
                  textInputFocus={textInputFocus}
                  key={index}
                />
              ))}
            </Pressable>
            <View style={OtpModalStyle.textInputWrapper}>
              <TextInput
                keyboardType="number-pad"
                maxLength={maxLength}
                style={OtpModalStyle.textInput}
                value={code}
                ref={textInputRef}
                onChangeText={(newCode) =>
                  isValidTextInput(newCode) && setCode(newCode)
                }
                onBlur={ontextInputBlur}
              />
            </View>
          </View>
          <Pressable
            disabled={!isOtpReady}
            style={[
              OtpModalStyle.submitButton,
              isOtpReady ? OtpModalStyle.submitButtonActive : {},
            ]}
            testID="submitOtpModal"
          >
            <Text style={OtpModalStyle.submitText}>{Strings.SUBMIT}</Text>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
}
