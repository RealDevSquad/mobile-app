import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface UserDetailsProps {
  name: string;
  username: string;
  designation: string;
  company: string;
}

const UserDetails = ({ name, username, designation, company }: UserDetailsProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.name}>{name}</Text>
      {!!username && <Text style={styles.username}>{'@' + username}</Text>}
      {!!designation && <Text style={styles.designation}>{designation}</Text>}
      {!!company && <Text style={styles.company}>{company}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
  },
  username: {
    fontSize: 13,
    textAlign: 'center',
    color: 'grey',
  },
  designation: {
    fontSize: 15,
    color: 'black',
    textAlign: 'center',
  },
  company: {
    fontSize: 13,
    fontWeight: 'bold',
    color: 'grey',
    textAlign: 'center',
  },
});

export default UserDetails;