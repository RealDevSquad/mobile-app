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

type Goal = {
  title: string;
  description: string;
  assignedTo: string;
  assignedToName: string;
  dueDate: Date | null;
};

export default function AddTodoScreen() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [goals, setGoals] = useState<Goal[]>([]); // State to store created goals

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

  const handleGoalSubmit = (title: string, description: string, assignedTo: string, assignedToName: string, dueDate: Date | null) => {
    const newGoal = { title, description, assignedTo, assignedToName, dueDate };
    setGoals((prevGoals) => [...prevGoals, newGoal]);
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
            members={members}
          />
        )}
        
        {/* Render the list of goals */}
        <View style={styles.goalsContainer}>
          {goals.map((goal, index) => (
            <View key={index} style={styles.goalCard}>
              <Text style={styles.goalTitle}>{goal.title}</Text>
              <Text style={styles.goalAssignedTo}>Assigned by: {goal.assignedToName}</Text>
              {goal.dueDate && (
                <Text style={styles.goalDueDate}>Due Date: {goal.dueDate.toLocaleDateString()}</Text>
              )}
            </View>
          ))}
        </View>
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
  goalsContainer: {
    marginTop: 20,
  },
  goalCard: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  goalAssignedTo: {
    fontSize: 14,
    color: '#666',
  },
  goalDueDate: {
    fontSize: 14,
    color: '#666',
  },
});