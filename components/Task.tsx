import moment from "moment";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";

const Task = ({
  tasks,
  onEndReached,
  loading = false,
}: {
  tasks: any[];
  onEndReached?: () => void;
  loading?: boolean;
}) => {
  const formatTimeAgo = (timestamp: number) => {
    const currentDate = moment();
    const endDate = moment.unix(timestamp);
    return endDate.from(currentDate);
  };

  const renderItem = ({ item }: { item: any }) => {
    return (
      <View style={styles.card}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.text}>
          Assignee: <Text style={styles.assignee}>{item.assignee}</Text>
        </Text>
        <Text style={styles.text}>
          Progress:{" "}
          <Text style={styles.progress}>{item.percentCompleted}%</Text>
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
      </View>
    );
  };

  const renderFooter = () => {
    if (loading) {
      return (
        <View style={styles.footerLoader}>
          <ActivityIndicator size="small" color="#0000ff" />
          <Text style={styles.loadingText}>Loading more tasks...</Text>
        </View>
      );
    }
    return null;
  };

  return tasks?.length > 0 ? (
    <FlatList
      data={tasks}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.1}
      showsVerticalScrollIndicator={false}
      ListFooterComponent={renderFooter}
    />
  ) : (
    <Text style={styles.emptyView}>No tasks found...</Text>
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
  assignee: {
    color: "grey",
  },
  progress: {
    color: "#27ae60",
    fontWeight: "bold",
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
  footerLoader: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  loadingText: {
    marginLeft: 10,
    color: "#666",
    fontSize: 14,
  },
});

export default Task;
