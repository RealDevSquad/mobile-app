import CreateGoalForm from '@/components/CreateGoalForm';
import GoalsApi from '@/constants/apiConstant/goals-api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';

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
  completed: boolean;
};

const STORAGE_KEY = '@goals'; // Key for AsyncStorage

export default function AddTodoScreen() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [goals, setGoals] = useState<Goal[]>([]); // State to store created goals
  const [expandedGoalIndex, setExpandedGoalIndex] = useState<number | null>(null); // State to track expanded goal

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
    loadGoals(); // Load goals from AsyncStorage when the component mounts
  }, []);

  const loadGoals = async () => {
    try {
      const storedGoals = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedGoals) {
        const parsedGoals = JSON.parse(storedGoals).map((goal: any) => ({
          ...goal,
          dueDate: goal.dueDate ? new Date(goal.dueDate) : null,
          completed: goal.completed || false,
        }));
        setGoals(parsedGoals);
      }
    } catch (error) {
      console.error('Failed to load goals:', error);
    }
  };

  const saveGoals = async (newGoals: Goal[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newGoals)); // Save goals to AsyncStorage
    } catch (error) {
      console.error('Failed to save goals:', error);
    }
  };

  const handleGoalSubmit = (title: string, description: string, assignedTo: string, assignedToName: string, dueDate: Date | null) => {
    const newGoal = { title, description, assignedTo, assignedToName, dueDate, completed: false }; // Include completed status
    const updatedGoals = [...goals, newGoal]; // Add new goal to the state
    setGoals(updatedGoals); // Update state
    saveGoals(updatedGoals); // Save updated goals to AsyncStorage
    Alert.alert('Success', 'Goal added successfully!');
    setIsFormVisible(false);
  };

  const toggleExpandGoal = (index: number) => {
    setExpandedGoalIndex(expandedGoalIndex === index ? null : index); // Toggle the expanded state
  };

  const markGoalComplete = (index: number) => {
    const updatedGoals = goals.map((goal, i) => 
      i === index ? { ...goal, completed: true } : goal
    );
    setGoals(updatedGoals);
    saveGoals(updatedGoals);
    Alert.alert('Success', 'Goal marked as complete!');
  };

  const renderLeftActions = (index: number) => (
    <TouchableOpacity
      style={styles.completeButton}
      onPress={() => markGoalComplete(index)}
    >
      <Text style={styles.completeButtonText}>Complete</Text>
    </TouchableOpacity>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
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
        
        {/* Render the list of goals only when the form is not visible */}
        {!isFormVisible && (
          <View style={styles.goalsContainer}>
            {goals.map((goal, index) => (
              <Swipeable key={index} renderLeftActions={() => renderLeftActions(index)}>
                <View style={styles.goalCard}>
                  <TouchableOpacity onPress={() => toggleExpandGoal(index)}>
                    <Text style={styles.goalTitle}>{goal.title}</Text>
                    <Text style={styles.goalAssignedTo}>Assigned to: {goal.assignedToName}</Text>
                    {goal.dueDate && (
                      <Text style={styles.goalDueDate}>Due Date: {goal.dueDate.toLocaleDateString()}</Text>
                    )}
                  </TouchableOpacity>
                  {expandedGoalIndex === index && ( // Check if this goal is expanded
                    <View style={styles.goalDetails}>
                      <Text style={styles.goalDescription}>Description: {goal.description}</Text>
                      <Text style={styles.goalAssignedBy}>Assigned by: {goal.assignedToName}</Text>
                      <Text style={styles.goalDeadline}>Deadline: {goal.dueDate ? goal.dueDate.toLocaleDateString() : 'No deadline set'}</Text>
                    </View>
                  )}
                </View>
              </Swipeable>
            ))}
          </View>
        )}
      </View>
    </GestureHandlerRootView>
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
  goalDetails: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#e9ecef',
    borderRadius: 5,
  },
  goalDescription: {
    fontSize: 14,
    color: '#333',
  },
  goalAssignedBy: {
    fontSize: 14,
    color: '#333',
  },
  goalDeadline: {
    fontSize: 14,
    color: '#333',
  },
  completeButton: {
    backgroundColor: '#4CAF50', // Green color for complete button
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: '100%',
  },
  completeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});