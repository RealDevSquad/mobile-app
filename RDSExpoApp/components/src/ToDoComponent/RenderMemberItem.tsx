import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';

type RenderMemberItemProps = {
  item: DisplayNameType;
  setSelectedMember: () => void;
};
type DisplayNameType = {
  github_display_name?: string;
  first_name?: string;
  last_name?: string;
  username?: string;
  github_id?: string;
};
const RenderMemberItem = ({
  item,
  setSelectedMember,
}: RenderMemberItemProps) => {
  const navigation = useNavigation();
  const { github_display_name, first_name, last_name, username, github_id } =
    item;
  const assignedTo =
    username ?? github_display_name ?? github_id ?? first_name + last_name;

  const handleSelectMember = (name: string) => {
    setSelectedMember(name);
    navigation.navigate('CreatingGoals');
  };

  return (
    <TouchableOpacity onPress={() => handleSelectMember(assignedTo)}>
      <View style={styles.itemContainer}>
        <Text style={styles.itemText}>{assignedTo}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default RenderMemberItem;

const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    marginTop: 10,
    marginBottom: 8,
    borderRadius: 8,
  },
  itemText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    padding: 4,
  },
});
