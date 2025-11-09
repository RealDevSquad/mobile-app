import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { CreateTaskRequestModal } from "../../tasks/create-task-request-modal";
import styles from "./create-task.styles";

export function CreateTaskSection() {
  const [createTaskRequestModalVisible, setCreateTaskRequestModalVisible] = useState(false);

  return (
    <>
      <Pressable
        style={({ pressed }) => [styles.createButton, pressed && styles.createButtonPressed]}
        onPress={() => setCreateTaskRequestModalVisible(true)}
      >
        <View style={styles.createButtonContent}>
          <View style={styles.createButtonIcon}>
            <FontAwesome5 name="plus-circle" size={24} color="#E30464" />
          </View>
          <View style={styles.createButtonTextContainer}>
            <Text style={styles.createButtonTitle}>Create Task Request</Text>
            <Text style={styles.createButtonSubtitle}>Request a new task from a GitHub issue</Text>
          </View>
          <FontAwesome5 name="chevron-right" size={16} color="#9CA3AF" />
        </View>
      </Pressable>

      <CreateTaskRequestModal
        visible={createTaskRequestModalVisible}
        onClose={() => setCreateTaskRequestModalVisible(false)}
      />
    </>
  );
}
