import { useRouter } from "expo-router";
import moment from "moment";
import React from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity } from "react-native";

const Task = ({ tasks }: { tasks: any[] }) => {
  const formatTimeAgo = (timestamp: number) => {
    const currentDate = moment();
    const endDate = moment.unix(timestamp);
    return endDate.from(currentDate);
  };
  const router = useRouter();

  const renderItem = ({ item }: { item: any }) => {
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          router.navigate({
            pathname: "/profile/details",
            params: {
              ...item, // Pass the entire item object
            },
          })
        }
      >
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.text}>
          Created By: <Text style={styles.createdBy}>{item.createdBy}</Text>
        </Text>
        <Text style={styles.text}>
          Assignee: <Text style={styles.assignee}>{item.assignee}</Text>
        </Text>
        <Text style={styles.text}>
          Ends On:{" "}
          <Text style={styles.endsOn}>{formatTimeAgo(item.endsOn)}</Text>
        </Text>
        <Text style={styles.text}>
          Started On:{" "}
          <Text style={styles.startedOn}>{formatTimeAgo(item.startedOn)}</Text>
        </Text>
        <Text style={[styles.text, styles.status]}>Status: {item.status}</Text>
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
    <Text style={styles.emptyView}>No active tasks found...</Text>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 16,
    margin: 12,
    backgroundColor: "white",
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#1D1283",
  },
  text: {
    fontSize: 16,
    marginBottom: 6,
    fontWeight: "bold",
    color: "#333",
  },
  createdBy: {
    color: "grey",
  },
  assignee: {
    color: "grey",
  },
  endsOn: {
    color: "grey",
  },
  startedOn: {
    color: "grey",
  },
  status: {
    fontWeight: "bold",
    color: "#3498db",
  },
  emptyView: {
    color: "black",
    marginTop: 20,
    textAlign: "center",
  },
});

export default Task;
