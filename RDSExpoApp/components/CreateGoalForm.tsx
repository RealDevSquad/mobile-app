import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Alert,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import DatePicker from "react-native-date-picker";

interface CreateGoalFormProps {
  onSubmit: (title: string, description: string, assignedTo: string, dueDate: Date | null) => void;
}

const CreateGoalForm: React.FC<CreateGoalFormProps> = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [assignedToName, setAssignedToName] = useState('');
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [openDatePicker, setOpenDatePicker] = useState(false);

  const handleSubmit = () => {
    if (!title.trim() || !description.trim() || !assignedTo) {
      Alert.alert('Error', 'Please fill out all fields');
      return;
    }
    onSubmit(title, description, assignedTo, dueDate);
    setTitle('');
    setDescription('');
    setAssignedTo('');
    setAssignedToName('');
    setDueDate(null);
  };

  return (
    <View style={styles.container}>
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
        onPress={() => {/* Implement dropdown logic here */}}
      >
        <View style={styles.dropdownContent}>
          <Text style={{ color: assignedToName ? '#000' : '#888' }}>
            {assignedToName || 'Assign To'}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#666" />
        </View>
      </TouchableOpacity>

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
  button: {
    backgroundColor: '#2819b2',
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 16,
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