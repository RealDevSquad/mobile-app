import GoalsApi from '@/constants/apiConstant/goals-api';
import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

type Member = {
  username: string;
  name: string;
  picture: string;
};

export default function AddTodoScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [assignedToName, setAssignedToName] = useState('');
  const [members, setMembers] = useState<Member[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch(GoalsApi.MEMBERS_API);
        const data = await response.json();

        const memberList = data.members.map((member: any) => ({
          username: member.username,
          name: member.first_name
            ? `${member.first_name} ${member.last_name || ''}`
            : member.username,
          picture: member.picture?.url || '',
        }));

        setMembers(memberList);
      } catch (error) {
        Alert.alert('Error', 'Failed to load members');
      } finally {
        setLoadingMembers(false);
      }
    };

    fetchMembers();
  }, []);

  const handleSubmit = () => {
    if (!title.trim() || !description.trim() || !assignedTo) {
      Alert.alert('Error', 'Please fill out all fields');
      return;
    }

    const newGoal = {
      title,
      description,
      assigned_to: assignedTo,
    };

    console.log('New Goal:', newGoal);
    Alert.alert('Success', 'Goal added successfully!');
    setTitle('');
    setDescription('');
    setAssignedTo('');
    setAssignedToName('');
  };

  const filteredMembers = members.filter((member) =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderMemberItem = ({ item }: { item: Member }) => (
    <TouchableOpacity
      style={styles.memberItem}
      onPress={() => {
        setAssignedTo(item.username);
        setAssignedToName(item.name);
        setShowDropdown(false);
      }}
    >
      <Image
        source={{ uri: item.picture || 'https://ui-avatars.com/api/?name=' + item.name }}
        style={styles.avatar}
      />
      <Text style={styles.memberName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: '',
          headerStyle: { backgroundColor: '#2819b2' },
          headerTintColor: '#fff',
        }}
      />
      <View style={styles.container}>
        <Text style={styles.title}>Create New Goal</Text>

        <TextInput
          style={styles.input}
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
        />

        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Description"
          multiline
          numberOfLines={4}
          value={description}
          onChangeText={setDescription}
        />

        {loadingMembers ? (
          <ActivityIndicator size="small" color="#2819b2" />
        ) : (
          <>
            <TouchableOpacity
              style={styles.dropdownSelector}
              onPress={() => setShowDropdown(true)}
            >
              <View style={styles.dropdownContent}>
                <Text style={{ color: assignedToName ? '#000' : '#888' }}>
                  {assignedToName || 'Assign To'}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#666" />
              </View>
            </TouchableOpacity>

            <Modal visible={showDropdown} transparent animationType="slide">
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <TextInput
                    placeholder="Search members..."
                    style={styles.searchInput}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                  />
                  <FlatList
                    data={filteredMembers}
                    keyExtractor={(item) => item.username}
                    renderItem={renderMemberItem}
                    keyboardShouldPersistTaps="handled"
                  />
                  <Pressable style={styles.closeButton} onPress={() => setShowDropdown(false)}>
                    <Text style={styles.buttonText}>Close</Text>
                  </Pressable>
                </View>
              </View>
            </Modal>
          </>
        )}

        <Pressable style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit</Text>
        </Pressable>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2819b2',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  dropdownSelector: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  dropdownContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    maxHeight: '70%',
    padding: 10,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  memberName: {
    marginLeft: 10,
    fontSize: 16,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#eee',
  },
  button: {
    backgroundColor: '#2819b2',
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 16,
  },
  closeButton: {
    backgroundColor: '#aaa',
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
