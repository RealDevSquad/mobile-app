import { formatDateTime } from '@/common/utils/common';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

const TaskDetails = () => {
  const { id, title, createdBy, assignee, endsOn, startedOn, status } =
    useLocalSearchParams();

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.card}>
        <Text style={styles.titleText}>{title ?? 'Title is unavailable'}</Text>
        <Text style={styles.statusBadge}>{status}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Details</Text>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>ID:</Text>
          <Text style={styles.detailValue}>{id}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Created By:</Text>
          <Text style={styles.detailValue}>{createdBy ?? 'Unknown'}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Assignee:</Text>
          <Text style={styles.detailValue}>{assignee}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Dates</Text>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Started On:</Text>
          <Text style={styles.detailValue}>
            {formatDateTime(Number(startedOn))}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Ends On:</Text>
          <Text style={styles.detailValue}>
            {formatDateTime(Number(endsOn))}
          </Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Note</Text>
        <Text style={styles.noteText}>
          To update progress, please log in to the website.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
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
  titleText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#4caf50',
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 12,
  },
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
  noteText: {
    fontSize: 16,
    color: '#777',
    lineHeight: 22,
  },
});

export default TaskDetails;
