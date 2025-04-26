import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
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
import DatePicker from "react-native-date-picker";

interface CreateGoalFormProps {
  onSubmit: (title: string, description: string, assignedTo: string, assignedToName: string, dueDate: Date | null) => void;
  onBack: () => void; 
  members: { username: string; name: string; picture: string }[];
}

const CreateGoalForm: React.FC<CreateGoalFormProps> = ({ onSubmit, onBack, members }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [assignedToName, setAssignedToName] = useState('');
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSubmit = () => {
    if (!title.trim() || !description.trim() || !assignedTo) {
      Alert.alert('Error', 'Please fill out all fields');
      return;
    }
    onSubmit(title, description, assignedTo, assignedToName, dueDate);
    setTitle('');
    setDescription('');
    setAssignedTo('');
    setAssignedToName('');
    setDueDate(null);
  };

  const filteredMembers = members.filter((member) =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderMemberItem = ({ item }: { item: { username: string; name: string; picture: string } }) => (
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
    <View style={styles.container}>
      {/* Back Icon */}
      <TouchableOpacity style={styles.backIcon} onPress={onBack}>
        <Ionicons name="arrow-back" size={24} color="#2819b2" />
      </TouchableOpacity>

      <Text style={styles.title}>Create New Goal</Text>

      <Text style={styles.label}>Title</Text>
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Description"
        multiline
        numberOfLines={4}
        value={description}
        onChangeText={setDescription}
      />

      <Text style={styles.label}>Assign To</Text>
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

      {/* Members Dropdown Modal */}
      <Modal visible={showDropdown} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search members..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <FlatList
              data={filteredMembers}
              keyExtractor={(item) => item.username}
              renderItem={renderMemberItem}
            />
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowDropdown(false)}>
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Text style={styles.label}>Deadline</Text>
      <TouchableOpacity
        style={styles.dropdownSelector}
        onPress={() => setOpenDatePicker(true)}
      >
        <View style={styles.dropdownContent}>
          <Text style={{ color: dueDate ? '#000' : '#888' }}>
            {dueDate ? dueDate.toLocaleDateString() : 'Select Due Date'}
          </Text>
          <Ionicons name="calendar" size={20} color="#666" />
        </View>
      </TouchableOpacity>

      <DatePicker
        modal
        open={openDatePicker}
        date={dueDate || new Date()}
        mode="date"
        onConfirm={(date) => {
          setOpenDatePicker(false);
          setDueDate(date);
        }}
        onCancel={() => setOpenDatePicker(false)}
      />

      <Pressable style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Create Goal</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 35,
    marginTop: 40,
  },
  backIcon: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 1,
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

export default CreateGoalForm;