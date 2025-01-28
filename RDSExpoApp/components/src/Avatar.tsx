import React from 'react';
import { Image, View } from 'react-native';
import Images from '../../constants/images/Image';

const Avatar = ({ uri, size }: { uri: string; size: number }) => {
  const uriToPass = uri ? uri : Images.DEFAULT_IMAGE;
  return (
    <View key={uriToPass} style={{ alignItems: 'center' }}>
      <Image
        resizeMode="cover"
        resizeMethod="scale"
        style={{ width: size, height: size, borderRadius: size }}
        source={{ uri: uriToPass }}
      />
    </View>
  );
};

export default Avatar;
