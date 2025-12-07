type LogLevel = "info" | "warn" | "error" | "debug";

interface LogEntry {
  id: string;
  timestamp: Date;
  level: LogLevel;
  message: string;
  data?: unknown;
  source?: string;
}

type LogListener = (logs: LogEntry[]) => void;

class Logger {
  private logs: LogEntry[] = [];
  private maxLogs = 500;
  private listeners: Set<LogListener> = new Set();

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private addLog(level: LogLevel, message: string, data?: unknown, source?: string) {
    const entry: LogEntry = {
      id: this.generateId(),
      timestamp: new Date(),
      level,
      message,
      data,
      source,
    };

    this.logs.unshift(entry);

    // Keep only the last maxLogs entries
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs);
    }

    // Notify listeners
    this.notifyListeners();
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => listener([...this.logs]));
  }

  info(message: string, data?: unknown, source?: string) {
    this.addLog("info", message, data, source);
  }

  warn(message: string, data?: unknown, source?: string) {
    this.addLog("warn", message, data, source);
  }

  error(message: string, data?: unknown, source?: string) {
    this.addLog("error", message, data, source);
  }

  debug(message: string, data?: unknown, source?: string) {
    this.addLog("debug", message, data, source);
  }

  // API specific logging helpers
  apiRequest(method: string, url: string, data?: unknown) {
    this.info(`${method.toUpperCase()} ${url}`, data, "API Request");
  }

  apiResponse(method: string, url: string, status: number, data?: unknown) {
    const level = status >= 400 ? "error" : "info";
    this.addLog(level, `${method.toUpperCase()} ${url} - ${status}`, data, "API Response");
  }

  apiError(method: string, url: string, error: unknown) {
    this.error(`${method.toUpperCase()} ${url} - Failed`, error, "API Error");
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  getLogsByLevel(level: LogLevel): LogEntry[] {
    return this.logs.filter((log) => log.level === level);
  }

  clearLogs() {
    this.logs = [];
    this.notifyListeners();
  }

  subscribe(listener: LogListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
}

export const logger = new Logger();
export type { LogEntry, LogLevel };
