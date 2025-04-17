import CreateGoalForm from '@/components/CreateGoalForm';
import GoalsApi from '@/constants/apiConstant/goals-api';
import { Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Member = {
  username: string;
  name: string;
  picture: string; 
};

export default function AddTodoScreen() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [isFormVisible, setIsFormVisible] = useState(false); // State to control form visibility

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
    setIsFormVisible(false);
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
      <View style={{ flex: 1, padding: 20 }}>
        {!isFormVisible ? (
          <View style={styles.headerContainer}>
            <Text style={styles.heading}>To Do's</Text>
            <TouchableOpacity 
              style={styles.addButton} 
              onPress={() => setIsFormVisible(true)}
            >
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <CreateGoalForm 
            onSubmit={handleGoalSubmit} 
            onBack={() => setIsFormVisible(false)} 
            members={members} // Pass the members to the form
          />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 40,
    margin: 20,
  },
  heading: {
    fontSize: 24,
    color: '#2819b2',
  },
  addButton: {
    backgroundColor: '#2819b2',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});