import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import ButtonStyle from './styles';

type AuthScreenButtonProps = {
  text: string;
  uri?: string;
  onPress?: () => void;
};

export function AuthScreenButton({
  text,
  uri,
  onPress,
}: AuthScreenButtonProps) {
  return (
    <View style={ButtonStyle.btnContainer}>
      <TouchableOpacity onPress={onPress} style={ButtonStyle.btnView}>
        {uri && (
          <View style={ButtonStyle.btnIcon}>
            <Image source={{ uri }} />
          </View>
        )}
        <View style={ButtonStyle.signInTxtView}>
          <Text style={ButtonStyle.signInText}>{text}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}
