import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

function Loader() {
  // TODO: revert once UI gets fix
  return (
    <View style={styles.loadingContainer}>
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  );
}

export default Loader;

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
  loadingContainer: {
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'black',
  },
});
