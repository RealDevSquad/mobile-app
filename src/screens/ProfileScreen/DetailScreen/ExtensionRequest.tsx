import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { TextInput } from 'react-native-gesture-handler';

export default function ExtensionRequest() {
  const navigation = useNavigation();

  const [reason, setReason] = useState('');
  const [title, setTitle] = useState('');
  const [oldEndsOn, setOldEndsOn] = useState('');
  const [newEndsOn, setNewEndsOn] = useState('');

  const postApi = () => {
    fetch('https://api.realdevsquad.com/extension-requests', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: reason,
        title: title,
        oldEndsOn: oldEndsOn,
        body: newEndsOn,
      }),
    })
      .then((response) => response.json())
      .then((responseData) => {
        console.log(JSON.stringify(responseData));
        console.log(JSON.stringify(responseData), 'PostApiCAlled');
      });
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>Extension Request form</Text>
        <Text style={styles.paragraph}>Reason :</Text>
        <TextInput
          value={reason}
          onChangeText={(text) => setReason(text)}
          style={styles.input}
          placeholder="Enter reason"
        />

        <Text style={styles.paragraph}>Title :</Text>
        <TextInput
          value={title}
          onChangeText={(text) => setTitle(text)}
          style={styles.input}
          placeholder="Enter reason"
        />

        <Text style={styles.paragraph}>Old Ends On :</Text>
        <TextInput
          value={oldEndsOn}
          onChangeText={(text) => setOldEndsOn(text)}
          style={styles.input}
          placeholder="Old Ends On"
        />

        <Text style={styles.paragraph}>New Ends On :</Text>
        <TextInput
          value={newEndsOn}
          onChangeText={(text) => setNewEndsOn(text)}
          style={styles.input}
          placeholder="New Date"
        />
      </View>

      <View style={styles.buttoncontainer}>
        <TouchableOpacity style={styles.button} onPress={postApi}>
          <Text style={styles.whiteText}>Create Extension</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttoncontainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.whiteText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: 'black',
    padding: 30,
  },

  paragraph: {
    margin: 5,
    fontSize: 18,
    fontWeight: 'normal',
    color: 'blue',
    justifyContent: 'flex-start',
  },

  formchild: {
    marginTop: 5,
    fontWeight: 'bold',
  },
  toggle: {
    display: 'flex',
    flexDirection: 'row',
    margin: 5,
    padding: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  togglechild: {
    margin: 5,
  },
  button: {
    backgroundColor: 'blue',
    padding: 6,
    marginTop: 12,
    width: '40%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
  },
  buttoncontainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    margin: 5,
    fontSize: 18,
    fontWeight: 'bold',
    color: 'blue',
    justifyContent: 'flex-start',
  },
  input: {
    borderColor: 'skyBlue',
    borderWidth: 2,
    fontSize: 15,
    backgroundColor: 'lightgrey',
  },
  whiteText: {
    color: 'white',
  },
});
