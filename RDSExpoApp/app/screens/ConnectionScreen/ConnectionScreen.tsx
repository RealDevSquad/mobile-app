import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Strings from '../../../components/i18n/en';
import StyleConfig from '../../../components/utils/StyleConfig';
import { scale } from '../../../components/utils/utils';
import Images from '../../../constants/images/Image';
Images


type RetryFunction = () => void;

interface ConnectionScreenProps {
  retryConnect: RetryFunction;
}

const ConnectionScreen: React.FC<ConnectionScreenProps> = ({
  retryConnect,
}) => {
  return (
    <View style={styles.container}>
      <Image source={Images.noInternet} style={styles.offlineImage} />
      <Text style={styles.noInternetText}>{Strings.OFFLINE_TEXT}</Text>
      <TouchableOpacity onPress={retryConnect} style={styles.retryButton}>
        <Text style={styles.retry}>Retry</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ConnectionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: StyleConfig.colors.white,
  },

  retryButton: {
    backgroundColor: StyleConfig.colors.primary,
    paddingHorizontal: scale(20),
    paddingVertical: scale(10),
    borderRadius: 8,
  },
  retry: {
    color: StyleConfig.colors.white,
  },

  noInternetText: {
    color: StyleConfig.colors.darkGrey,
    fontWeight: '500',
    fontSize: scale(16),
    margin: scale(10),
  },

  offlineImage: {
    height: scale(150),
    width: scale(150),
  },
});
