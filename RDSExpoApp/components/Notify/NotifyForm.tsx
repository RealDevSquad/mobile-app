import {
  View,
  Text,
  TextInput,
  Picker,
  Button,
  StyleSheet,
} from 'react-native';
import React, { useState } from 'react';

const NotifyForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [notifyTo, setNotifyTo] = useState('');

  const handleButtonPress = () => {
    // Handle the button press and perform necessary actions (e.g., send notification)
    console.log('Notification sent:', { title, description, notifyTo });
  };
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Title:</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={(text) => setTitle(text)}
        placeholder="Enter title"
      />

      <Text style={styles.label}>Description:</Text>
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={(text) => setDescription(text)}
        placeholder="Enter description"
        multiline
      />

      <Text style={styles.label}>Notify To:</Text>
      <Picker
        style={styles.input}
        selectedValue={notifyTo}
        onValueChange={(itemValue) => setNotifyTo(itemValue)}
      >
        <Picker.Item label="User 1" value="user1" />
        <Picker.Item label="User 2" value="user2" />
        {/* Add more items as needed */}
      </Picker>

      <Button title="Send Notification" onPress={handleButtonPress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
});

export default NotifyForm;
