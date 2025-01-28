import React from 'react';
import { Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import moment from 'moment';
import { displayContributionType, taskType } from './UserContibution/Type';
import { useNavigation } from '@react-navigation/native';
type TaskItem = {
  taskId: string;
  isActive: string;
};
const DisplayContribution = ({ tasks }: { tasks: taskType }) => {
  const navigation = useNavigation();

  const formatTimeAgo = (timestamp: number) => {
    const currentDate = moment();
    const endDate = moment.unix(timestamp);
    return endDate.from(currentDate);
  };
  const navigationHandler = (item: TaskItem) => {
    navigation.navigate('TaskDetail', {
      title: item.title,
      taskId: item.id,
      isActive: item.status !== 'COMPLETED',
    });
  };
  const renderItem = ({ item }: { item: displayContributionType }) => {
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigationHandler(item)}
      >
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.text}>
          Created By: <Text style={styles.createdBy}>{item.createdBy}</Text>
        </Text>
        <Text style={styles.text}>
          Assignee: <Text style={styles.assignee}>{item.assignee}</Text>
        </Text>
        <Text style={styles.text}>
          Ends On:{' '}
          <Text style={styles.endsOn}>{formatTimeAgo(item.endsOn)}</Text>
        </Text>
        <Text style={styles.text}>
          Started On:{' '}
          <Text style={styles.startedOn}>{formatTimeAgo(item.startedOn)}</Text>
        </Text>
        <Text style={[styles.text, styles.status]}>Status: {item.status}</Text>
        {/* {isActive &&
          (isProdEnvironment ? (
            <></>
          ) : (
            <TouchableOpacity onPress={() => setCollapsed(!isCollapsed)}>
              <Text style={styles.isActiveButton}>
                {isCollapsed ? 'isActive' : 'Collapse'}
              </Text>
            </TouchableOpacity>
          ))} */}
      </TouchableOpacity>
    );
  };

  return tasks?.length > 0 ? (
    <FlatList
      data={tasks}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
    />
  ) : (
    <Text style={styles.emptyView}>No tasks found...</Text>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 16,
    margin: 12,
    backgroundColor: 'white',
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1D1283',
  },
  text: {
    fontSize: 16,
    marginBottom: 6,
    fontWeight: 'bold',
    color: '#333',
  },
  createdBy: {
    color: 'grey',
  },
  assignee: {
    color: 'grey',
  },
  endsOn: {
    color: 'grey',
  },
  startedOn: {
    color: 'grey',
  },
  status: {
    fontWeight: 'bold',
    color: '#3498db',
  },

  isActiveButton: {
    color: '#3498db',
    marginTop: 10,
  },

  isActiveableContent: {
    paddingBottom: 30,
  },

  progressBar: {
    width: '100%',
    // marginBottom: 16,
  },

  progressControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // marginBottom: 16,
  },

  button: {
    fontSize: 20,
    color: '#3498db',
  },

  progressText: {
    fontSize: 18,
    color: '#333',
  },
  emptyView: {
    color: 'black',
    marginTop: 20,
  },
});

export default DisplayContribution;
