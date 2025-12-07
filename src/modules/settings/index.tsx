import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import * as Clipboard from "expo-clipboard";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { appConfig } from "../../config/app.config";
import { logger, LogEntry, LogLevel } from "../../utils/logger";
import styles from "./settings.styles";

interface ApiCall {
  id: string;
  method: string;
  path: string;
  timestamp: Date;
  requestBody?: unknown;
  responseStatus?: number;
  responseBody?: unknown;
  error?: unknown;
  isError: boolean;
}

type TabType = "api" | "all";

export function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("api");

  useEffect(() => {
    setLogs(logger.getLogs());

    const unsubscribe = logger.subscribe((updatedLogs) => {
      setLogs(updatedLogs);
    });

    return unsubscribe;
  }, []);

  // Group API logs by request
  const apiCalls: ApiCall[] = [];
  const requestLogs = logs.filter((log) => log.source === "API Request");

  requestLogs.forEach((requestLog) => {
    const method = requestLog.message.split(" ")[0];
    const path = requestLog.message.split(" ").slice(1).join(" ");

    // Find matching response
    const responseLogs = logs.filter(
      (log) =>
        (log.source === "API Response" || log.source === "API Error") &&
        log.message.includes(path) &&
        log.timestamp >= requestLog.timestamp
    );

    const responseLog = responseLogs.length > 0 ? responseLogs[responseLogs.length - 1] : null;

    const statusMatch = responseLog?.message.match(/- (\d+)$/);
    const status = statusMatch ? parseInt(statusMatch[1], 10) : undefined;

    apiCalls.push({
      id: requestLog.id,
      method,
      path,
      timestamp: requestLog.timestamp,
      requestBody: requestLog.data,
      responseStatus: status,
      responseBody: responseLog?.data,
      error: responseLog?.source === "API Error" ? responseLog.data : undefined,
      isError: responseLog?.level === "error" || false,
    });
  });

  const handleClearLogs = () => {
    logger.clearLogs();
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  const formatJson = (data: unknown): string => {
    if (data === undefined || data === null) return "null";
    try {
      if (typeof data === "object") {
        return JSON.stringify(data, null, 2);
      }
      return String(data);
    } catch {
      return "[Unable to stringify]";
    }
  };

  const generateCurl = (call: ApiCall): string => {
    const baseUrl = appConfig.backendBaseUrl;
    const fullUrl = `${baseUrl}${call.path}`;

    let curl = `curl -X ${call.method} '${fullUrl}'`;
    curl += ` \\\n  -H 'Content-Type: application/json'`;
    curl += ` \\\n  -H 'Authorization: Bearer <token>'`;

    if (call.requestBody && Object.keys(call.requestBody as object).length > 0) {
      curl += ` \\\n  -d '${JSON.stringify(call.requestBody)}'`;
    }

    return curl;
  };

  const getMethodColor = (method: string) => {
    switch (method.toUpperCase()) {
      case "GET":
        return "#10B981";
      case "POST":
        return "#3B82F6";
      case "PUT":
        return "#F59E0B";
      case "PATCH":
        return "#8B5CF6";
      case "DELETE":
        return "#EF4444";
      default:
        return "#6B7280";
    }
  };

  const getStatusColor = (status?: number) => {
    if (!status) return "#6B7280";
    if (status >= 200 && status < 300) return "#10B981";
    if (status >= 400 && status < 500) return "#F59E0B";
    if (status >= 500) return "#EF4444";
    return "#6B7280";
  };

  const getLevelColor = (level: LogLevel) => {
    switch (level) {
      case "info":
        return "#3B82F6";
      case "warn":
        return "#F59E0B";
      case "error":
        return "#EF4444";
      case "debug":
        return "#6B7280";
      default:
        return "#6B7280";
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleCopy = async (text: string) => {
    await Clipboard.setStringAsync(text);
  };

  const renderApiTab = () => {
    if (apiCalls.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <FontAwesome5 name="server" size={48} color="#D1D5DB" />
          <Text style={styles.emptyText}>No API calls yet</Text>
          <Text style={styles.emptySubtext}>API requests will appear here</Text>
        </View>
      );
    }

    return apiCalls.map((call) => (
      <View key={call.id} style={[styles.apiCard, call.isError && styles.apiCardError]}>
        <Pressable style={styles.apiCardHeader} onPress={() => toggleExpand(call.id)}>
          <View style={styles.apiCardHeaderLeft}>
            <View style={[styles.methodBadge, { backgroundColor: getMethodColor(call.method) }]}>
              <Text style={styles.methodText}>{call.method}</Text>
            </View>
            <Text style={styles.pathText} numberOfLines={1}>
              {call.path}
            </Text>
          </View>
          <View style={styles.apiCardHeaderRight}>
            {call.responseStatus && (
              <Text style={[styles.statusText, { color: getStatusColor(call.responseStatus) }]}>
                {call.responseStatus}
              </Text>
            )}
            <Text style={styles.timestampText}>{formatTimestamp(call.timestamp)}</Text>
            <FontAwesome5
              name={expandedId === call.id ? "chevron-up" : "chevron-down"}
              size={12}
              color="#6B7280"
            />
          </View>
        </Pressable>

        {expandedId === call.id && (
          <View style={styles.apiCardContent}>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Request Body</Text>
                <Pressable
                  style={styles.copyButton}
                  onPress={() =>
                    handleCopy(call.requestBody ? formatJson(call.requestBody) : "No request body")
                  }
                >
                  <FontAwesome5 name="copy" size={12} color="#6B7280" />
                </Pressable>
              </View>
              <View style={styles.codeBlock}>
                <Text style={styles.codeText}>
                  {call.requestBody ? formatJson(call.requestBody) : "No request body"}
                </Text>
              </View>
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>
                  Response {call.responseStatus && `(${call.responseStatus})`}
                </Text>
                <Pressable
                  style={styles.copyButton}
                  onPress={() =>
                    handleCopy(call.responseBody ? formatJson(call.responseBody) : "No response")
                  }
                >
                  <FontAwesome5 name="copy" size={12} color="#6B7280" />
                </Pressable>
              </View>
              <View style={[styles.codeBlock, call.isError && styles.codeBlockError]}>
                <Text style={styles.codeText}>
                  {call.responseBody ? formatJson(call.responseBody) : "No response"}
                </Text>
              </View>
            </View>

            {call.error !== undefined && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, styles.errorTitle]}>Error</Text>
                <View style={styles.codeBlockError}>
                  <Text style={styles.codeText}>{formatJson(call.error)}</Text>
                </View>
              </View>
            )}

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>cURL</Text>
                <Pressable style={styles.copyButton} onPress={() => handleCopy(generateCurl(call))}>
                  <FontAwesome5 name="copy" size={12} color="#6B7280" />
                </Pressable>
              </View>
              <View style={styles.codeBlock}>
                <Text style={styles.codeText}>{generateCurl(call)}</Text>
              </View>
            </View>
          </View>
        )}
      </View>
    ));
  };

  const renderAllLogsTab = () => {
    if (logs.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <FontAwesome5 name="list" size={48} color="#D1D5DB" />
          <Text style={styles.emptyText}>No logs yet</Text>
          <Text style={styles.emptySubtext}>App logs will appear here</Text>
        </View>
      );
    }

    return logs.map((log) => {
      const logContent =
        log.data !== undefined && log.data !== null
          ? `${log.message}\n\n${formatJson(log.data)}`
          : log.message;

      return (
        <View key={log.id} style={styles.logCard}>
          <View style={styles.logCardHeader}>
            <View style={[styles.levelBadge, { backgroundColor: getLevelColor(log.level) }]}>
              <Text style={styles.levelText}>{log.level.toUpperCase()}</Text>
            </View>
            {log.source && <Text style={styles.sourceText}>{log.source}</Text>}
            <Text style={styles.timestampText}>{formatTimestamp(log.timestamp)}</Text>
            <Pressable style={styles.copyButton} onPress={() => handleCopy(logContent)}>
              <FontAwesome5 name="copy" size={12} color="#6B7280" />
            </Pressable>
          </View>
          <Text style={styles.logMessage}>{log.message}</Text>
          {log.data !== undefined && log.data !== null && (
            <View style={styles.logDataBlock}>
              <Text style={styles.logDataText}>{formatJson(log.data)}</Text>
            </View>
          )}
        </View>
      );
    });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <FontAwesome5 name="arrow-left" size={18} color="#1F2937" />
        </Pressable>
        <Text style={styles.headerTitle}>Logs</Text>
        <View style={styles.headerRight}>
          <Pressable style={styles.clearButton} onPress={handleClearLogs}>
            <Text style={styles.clearButtonText}>Clear</Text>
          </Pressable>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <Pressable
          style={[styles.tab, activeTab === "api" && styles.tabActive]}
          onPress={() => setActiveTab("api")}
        >
          <Text style={[styles.tabText, activeTab === "api" && styles.tabTextActive]}>
            API ({apiCalls.length})
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === "all" && styles.tabActive]}
          onPress={() => setActiveTab("all")}
        >
          <Text style={[styles.tabText, activeTab === "all" && styles.tabTextActive]}>
            All Logs ({logs.length})
          </Text>
        </Pressable>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
        {activeTab === "api" ? renderApiTab() : renderAllLogsTab()}
      </ScrollView>
    </View>
  );
}
