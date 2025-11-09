import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import React, { useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { ProgressUpdateDTO } from "../../api/tasks/task.dto";
import { getInitialsFromName } from "../../utils/common.utils";
import styles from "./progress-accordion.styles";

type ProgressAccordionItemProps = {
  progress: ProgressUpdateDTO;
  isLast: boolean;
};

function ProgressAccordionItem({ progress, isLast }: ProgressAccordionItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const user = progress.userData;
  const userName = [user.first_name, user.last_name].filter(Boolean).join(" ") || user.username;
  const initials = getInitialsFromName(userName);
  const updateDate = new Date(progress.date * 1000).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <View style={[styles.accordionItem, isLast && styles.accordionItemLast]}>
      <Pressable
        style={({ pressed }) => [styles.accordionHeader, pressed && { opacity: 0.7 }]}
        onPress={() => setIsExpanded(!isExpanded)}
      >
        <View style={styles.accordionHeaderLeft}>
          <View style={styles.userAvatar}>
            {user.picture?.url ? (
              <Image source={{ uri: user.picture.url }} style={styles.userAvatarImage} />
            ) : (
              <Text style={styles.userAvatarText}>{initials}</Text>
            )}
          </View>
          <View style={styles.accordionHeaderInfo}>
            <Text style={styles.userName}>{userName}</Text>
            <Text style={styles.updateDate}>{updateDate}</Text>
          </View>
        </View>
        <FontAwesome5 name={isExpanded ? "chevron-up" : "chevron-down"} size={14} color="#6B7280" />
      </Pressable>

      {isExpanded ? (
        <View style={styles.accordionContent}>
          {progress.completed ? (
            <View style={styles.progressField}>
              <View style={styles.progressFieldHeader}>
                <FontAwesome5 name="check-circle" size={14} color="#10B981" />
                <Text style={styles.progressFieldLabel}>Completed</Text>
              </View>
              <Text style={styles.progressFieldValue}>{progress.completed}</Text>
            </View>
          ) : null}

          {progress.planned ? (
            <View style={styles.progressField}>
              <View style={styles.progressFieldHeader}>
                <FontAwesome5 name="calendar-check" size={14} color="#3B82F6" />
                <Text style={styles.progressFieldLabel}>Planned</Text>
              </View>
              <Text style={styles.progressFieldValue}>{progress.planned}</Text>
            </View>
          ) : null}

          {progress.blockers ? (
            <View style={styles.progressField}>
              <View style={styles.progressFieldHeader}>
                <FontAwesome5 name="exclamation-triangle" size={14} color="#F59E0B" />
                <Text style={styles.progressFieldLabel}>Blockers</Text>
              </View>
              <Text style={styles.progressFieldValue}>{progress.blockers}</Text>
            </View>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

type ProgressAccordionProps = {
  progressUpdates: ProgressUpdateDTO[];
};

export function ProgressAccordion({ progressUpdates }: ProgressAccordionProps) {
  if (!progressUpdates || progressUpdates.length === 0) {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Progress Updates</Text>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No progress updates yet</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Progress Updates ({progressUpdates.length})</Text>
      <View style={styles.accordionContainer}>
        {progressUpdates.map((progress, index) => (
          <ProgressAccordionItem
            key={progress.id}
            progress={progress}
            isLast={index === progressUpdates.length - 1}
          />
        ))}
      </View>
    </View>
  );
}
