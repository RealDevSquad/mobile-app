import React from 'react';
import { View } from 'react-native';
import { styles } from './styles';

type Props = {
  isLoading: Boolean;
  children: React.JSX.Element;
};

export default function Skelton({ isLoading, children }: Props) {
  if (isLoading) {
    return (
      <View style={styles.skeltonContainer} testID="skelton">
        <View style={styles.skeltonPlaceholder} />
        <View style={styles.skeltonPlaceholder} />
        <View style={styles.skeltonPlaceholder} />
      </View>
    );
  }
  return children;
}
