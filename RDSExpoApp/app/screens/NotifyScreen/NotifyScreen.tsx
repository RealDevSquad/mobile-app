import React from 'react';
import { StyleSheet, View } from 'react-native';
import NotifyButton from '../../../components/Notify/NotifyButton';
import Colors from '../../../constants/colors/Colors';

const NotifyScreen = () => {
  const onNotifyHandler = () => {
    console.log('notify');
  };
  return (
    <View style={styles.container}>
      <NotifyButton
        onPress={onNotifyHandler}
        title={'Notify'}
        buttonStyle={{ backgroundColor: Colors.Primary_Color }}
        textStyle={{ color: 'white' }}
      />
    </View>
  );
};

export default NotifyScreen;
const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
});
