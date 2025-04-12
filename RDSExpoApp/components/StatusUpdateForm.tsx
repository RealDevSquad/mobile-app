import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import DatePicker from 'react-native-date-picker';

interface StatusUpdateFormProps {
  onSubmit: (fromDate: string, toDate: string, description: string) => void;
  onClose: () => void; // Callback to handle closing the form
}

const StatusUpdateForm: React.FC<StatusUpdateFormProps> = ({ onSubmit, onClose }) => {
  const [fromDate, setFromDate] = useState<Date | null>(null); // State for From Date
  const [toDate, setToDate] = useState<Date | null>(null); // State for To Date
  const [description, setDescription] = useState('');
  const [openFromDatePicker, setOpenFromDatePicker] = useState(false); // State to toggle From Date picker
  const [openToDatePicker, setOpenToDatePicker] = useState(false); // State to toggle To Date picker

  const formatDate = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`; // Format as DD-MM-YYYY
  };

  const isFormValid = (): boolean => {
    if (!fromDate || !toDate) {
      Alert.alert('Error', 'Please select both From Date and To Date.');
      return false;
    }
    if (fromDate >= toDate) {
      Alert.alert('Error', 'From Date must be less than To Date.');
      return false;
    }
    if (!description) {
      Alert.alert('Error', 'Description is required.');
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (isFormValid()) {
      const formattedFromDate = fromDate ? formatDate(fromDate) : '';
      const formattedToDate = toDate ? formatDate(toDate) : '';
      onSubmit(formattedFromDate, formattedToDate, description);
      setFromDate(null);
      setToDate(null);
      setDescription('');
    }
  };

  return (
    <View style={styles.wrapper}>
      {/* Close Icon */}
      <TouchableOpacity style={styles.closeIcon} onPress={onClose}>
        <Ionicons name="close" size={24} color="black" />
      </TouchableOpacity>

      {/* From Date Picker */}
      <TouchableOpacity
        style={[styles.input, styles.spaceAbove]}
        onPress={() => setOpenFromDatePicker(true)}
      >
        <Text style={styles.dateText}>
          {fromDate ? formatDate(fromDate) : 'Select From Date'}
        </Text>
      </TouchableOpacity>
      <DatePicker
        modal
        open={openFromDatePicker}
        date={fromDate || new Date()}
        mode="date"
        onConfirm={(date) => {
          setOpenFromDatePicker(false);
          setFromDate(date);
        }}
        onCancel={() => setOpenFromDatePicker(false)}
      />

      {/* To Date Picker */}
      <TouchableOpacity
        style={styles.input}
        onPress={() => setOpenToDatePicker(true)}
      >
        <Text style={styles.dateText}>
          {toDate ? formatDate(toDate) : 'Select To Date'}
        </Text>
      </TouchableOpacity>
      <DatePicker
        modal
        open={openToDatePicker}
        date={toDate || new Date()}
        mode="date"
        onConfirm={(date) => {
          setOpenToDatePicker(false);
          setToDate(date);
        }}
        onCancel={() => setOpenToDatePicker(false)}
      />

      {/* Description Input */}
      <TextInput
        placeholder="Add description"
        style={[styles.input, styles.textArea]}
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
      />

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 20,
    width: '80%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: '#fff',
    position: 'relative',
  },
  closeIcon: {
    position: 'absolute',
    top: 14,
    right: 18,
    zIndex: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: '100%',
    justifyContent: 'center',
  },
  dateText: {
    color: '#555',
  },
  textArea: {
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: '#0034a5',
    paddingVertical: 10,
    paddingHorizontal: 12,
    width: '30%',
    borderRadius: 10,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: 30,
  },
  submitButtonText: {
    color: '#fff',
    alignSelf: 'center',
    fontWeight: 'bold',
  },
  spaceAbove: {
    marginTop: 50,
  },
});

export default StatusUpdateForm;