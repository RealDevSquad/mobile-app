import { theme } from '@/constants/theme';
import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, View } from 'react-native';

const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

const Avatar = ({ uri, size }: { uri: string; size: number }) => {
  const uriToPass = uri ? uri : '';

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Image
        style={[
          styles.image,
          { width: size, height: size, borderRadius: size / 2 },
        ]}
        testID="avatar-image"
        source={uriToPass}
        placeholder={{ blurhash }}
        contentFit="cover"
        transition={1000}
      />
      <View
        style={[
          styles.border,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: 2,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  image: {
    backgroundColor: theme.colors.surface.secondary,
  },
  border: {
    position: 'absolute',
    borderColor: theme.colors.gray[300],
    pointerEvents: 'none',
  },
});

export default Avatar;
