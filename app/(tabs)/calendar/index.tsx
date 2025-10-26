import { LogsApi } from "@/api/logs/logs.api";
import ActivityDetailBottomSheet from "@/components/ActivityDetailBottomSheet";
import UserSearchModal from "@/components/UserSearchModal";
import useCheckUserSession from "@/hooks/getUserToken";
import {
  generateDateStatusMessage,
  getActivitiesForDate,
  processLogsToMarkedDates,
} from "@/utils/calendarUtils";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CalendarScreen() {
  const { token } = useCheckUserSession();
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [selectedUsername, setSelectedUsername] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState<string>(
    new Date().toISOString().slice(0, 7)
  );
  const [markedDates, setMarkedDates] = useState<any>({});
  const [selectedDateActivities, setSelectedDateActivities] =
    useState<any>(null);

  // Fetch user logs when username is selected
  const { data: calendarLogsData, isLoading: loadingLogs } = useQuery({
    queryKey: LogsApi.getUserLogs.key(selectedUsername || ""),
    queryFn: () =>
      LogsApi.getUserLogs.fn(
        { username: selectedUsername! },
        token || undefined
      ),
    enabled: !!token && !!selectedUsername,
  });

  const calendarLogs = calendarLogsData?.data || [];

  useEffect(() => {
    if (calendarLogs.length > 0) {
      try {
        const processedMarkedDates = processLogsToMarkedDates(calendarLogs);
        setMarkedDates(processedMarkedDates);
      } catch (error) {
        console.error("Error processing calendar logs:", error);
        setMarkedDates({});
      }
    } else {
      setMarkedDates({});
    }

    setStatusMessage("");
  }, [calendarLogs, loadingLogs]);

  const handleUserSelect = (username: string) => {
    setSelectedUsername(username);
    setShowSearchModal(false);
    setStatusMessage("");
  };

  const handleClearUser = () => {
    setSelectedUsername(null);
    setMarkedDates({});
    setSelectedDateActivities(null);
    setStatusMessage("");
  };

  const handleMonthChange = (month: any) => {
    const monthString = `${month.year}-${String(month.month).padStart(2, "0")}`;
    setCurrentMonth(monthString);
  };

  const handleDayPress = (day: any) => {
    if (calendarLogs.length > 0 && selectedUsername) {
      const activities = getActivitiesForDate(calendarLogs, day.dateString);
      setSelectedDateActivities(activities);

      // Generate status message for the selected date
      const message = generateDateStatusMessage(
        day.dateString,
        selectedUsername,
        calendarLogs
      );
      setStatusMessage(message);

      if (activities) {
        setShowActivityModal(true);
      }
    }
  };

  const handleCloseActivityModal = () => {
    setShowActivityModal(false);
    setSelectedDateActivities(null);
    setStatusMessage("");
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyTitle}>No User Selected</Text>
      <Text style={styles.emptyDescription}>
        Select a user to view their activity calendar
      </Text>
      <TouchableOpacity
        style={styles.searchButton}
        onPress={() => setShowSearchModal(true)}
      >
        <Text style={styles.searchButtonText}>Search Users</Text>
      </TouchableOpacity>
    </View>
  );

  const renderLoadingState = () => (
    <View style={styles.loadingState}>
      <ActivityIndicator size="large" color="#007AFF" />
      <Text style={styles.loadingText}>Loading activities...</Text>
    </View>
  );

  const renderCalendar = () => (
    <View style={styles.calendarContainer}>
      <Calendar
        current={currentMonth}
        onMonthChange={handleMonthChange}
        onDayPress={handleDayPress}
        markedDates={markedDates}
        markingType="multi-dot"
        theme={{
          backgroundColor: "#ffffff",
          calendarBackground: "#ffffff",
          textSectionTitleColor: "#b6c1cd",
          selectedDayBackgroundColor: "#007AFF",
          selectedDayTextColor: "#ffffff",
          todayTextColor: "#007AFF",
          dayTextColor: "#2d4150",
          textDisabledColor: "#d9e1e8",
          dotColor: "#007AFF",
          selectedDotColor: "#ffffff",
          arrowColor: "#007AFF",
          disabledArrowColor: "#d9e1e8",
          monthTextColor: "#2d4150",
          indicatorColor: "#007AFF",
          textDayFontWeight: "300",
          textMonthFontWeight: "bold",
          textDayHeaderFontWeight: "300",
          textDayFontSize: 16,
          textMonthFontSize: 16,
          textDayHeaderFontSize: 13,
        }}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {selectedUsername && (
        <View style={styles.userInfo}>
          <View style={styles.userInfoLeft}>
            <Text style={styles.userText}>Viewing: {selectedUsername}</Text>
          </View>
          <TouchableOpacity
            onPress={handleClearUser}
            style={styles.clearButton}
          >
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>
        </View>
      )}

      {(() => {
        if (!selectedUsername) {
          return renderEmptyState();
        }
        if (loadingLogs) {
          return renderLoadingState();
        }
        return renderCalendar();
      })()}

      <UserSearchModal
        visible={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        onUserSelect={handleUserSelect}
      />

      {statusMessage && selectedUsername && (
        <View style={styles.statusMessage}>
          <Text style={styles.statusText}>{statusMessage}</Text>
        </View>
      )}

      <ActivityDetailBottomSheet
        visible={showActivityModal}
        onClose={handleCloseActivityModal}
        activities={selectedDateActivities}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333333",
  },
  userInfo: {
    marginHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  userInfoLeft: {
    flex: 1,
  },
  userText: {
    fontSize: 14,
    color: "#666666",
  },
  clearButton: {
    backgroundColor: "#FF3B30",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  clearButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  searchButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  searchButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    marginBottom: 24,
  },
  loadingState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#666666",
    marginTop: 12,
  },
  calendarContainer: {
    flex: 1,
    padding: 16,
  },
  statusMessage: {
    margin: 16,
    padding: 12,
    backgroundColor: "#E3F2FD",
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#2196F3",
  },
  statusText: {
    fontSize: 14,
    color: "#1976D2",
    fontWeight: "500",
  },
});
