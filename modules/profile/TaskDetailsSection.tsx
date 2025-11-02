import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type TaskDetailsSectionProps = {
  title: string;
  children: React.ReactNode;
};

export const TaskDetailsSection: React.FC<TaskDetailsSectionProps> = ({
  title,
  children,
}) => {
  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 12,
  },
});
