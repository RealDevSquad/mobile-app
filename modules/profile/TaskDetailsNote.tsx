import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TaskDetailsSection } from './TaskDetailsSection';

export const TaskDetailsNote: React.FC = () => {
  return (
    <TaskDetailsSection title="Note">
      <Text style={styles.noteText}>
        To update progress, please log in to the website.
      </Text>
    </TaskDetailsSection>
  );
};

const styles = StyleSheet.create({
  noteText: {
    fontSize: 16,
    color: '#777',
    lineHeight: 22,
  },
});
