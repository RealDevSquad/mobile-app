import CreateGoalForm from '@/components/CreateGoalForm';
import GoalsApi from '@/constants/apiConstant/goals-api';
import { Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
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
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [openDatePicker, setOpenDatePicker] = useState(false);

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

  const handleGoalSubmit = (title: string, description: string, assignedTo: string, dueDate: Date | null) => {
    console.log('New Goal:', { title, description, assignedTo, dueDate });
    Alert.alert('Success', 'Goal added successfully!');
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

  const handleDateChange = (date: Date) => {
    setOpenDatePicker(false);
    setDueDate(date);
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: '',
          headerStyle: { backgroundColor: '#2819b2' },
          headerTintColor: '#fff',
        }}
      />
      <View style={{ flex: 1 }}>
        <CreateGoalForm onSubmit={handleGoalSubmit} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 35,
    marginTop:40,
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
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
});
