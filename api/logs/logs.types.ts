import { LogEntry } from "@/types/logs.dto";

// Request DTOs
export type TGetUserLogsDto = {
  username: string;
  startDate?: number;
  endDate?: number;
};

// Response DTOs
export type TGetUserLogsResponse = {
  data: LogEntry[];
};
