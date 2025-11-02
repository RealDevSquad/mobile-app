import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type TaskDetailsRowProps = {
  label: string;
  value: string;
};

export const TaskDetailsRow: React.FC<TaskDetailsRowProps> = ({
  label,
  value,
}) => {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '400',
    color: '#333',
  },
});
