import React from 'react';
import { ActivityIndicator, Modal, StyleSheet, View } from 'react-native';

function LoadingScreen() {
  return (
    <Modal transparent={true}>
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    </Modal>
  );
}

export default LoadingScreen;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    position: 'absolute',
    zIndex: 1,
  },
});
