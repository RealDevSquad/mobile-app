import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function ProfileScreen() {
  const handleNotify = () => {
    
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.notifyButton} onPress={handleNotify}>
        <Text style={styles.notifyText}>Notify</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    padding:30,
  },
  notifyButton: {
    backgroundColor: '#2819b2',
    paddingVertical: 14,
    paddingHorizontal: 16,
    width: '100%',
    alignItems: 'center',
    borderRadius:8,
  },
  notifyText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
