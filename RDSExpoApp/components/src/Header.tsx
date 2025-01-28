import React from 'react';
import { Image, SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';
import Colors from '../../constants/colors/Colors';
import Images from '../../constants/images/Image';

const Header = () => {
  return (
    <SafeAreaView style={{ backgroundColor: Colors.Primary_Color }}>
      <View style={styles.container}>
        <Image source={Images.rdsLogo} style={styles.logo} />
        <StatusBar barStyle={'light-content'} />
      </View>
    </SafeAreaView>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: Colors.Primary_Color,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  logo: {
    width: 45,
    height: 45,
  },
});
