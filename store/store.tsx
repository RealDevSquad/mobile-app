import { EXTENSION_REQUEST_API } from "@/constants/apiConstant/extension-request-api";
import { HomeApi } from "@/constants/apiConstant/home-api";
import { TASK_API } from "@/constants/apiConstant/task-api";
import { TASK_REQUEST_API } from "@/constants/apiConstant/task-request-api";
import { USER_API } from "@/constants/apiConstant/user-api";
import { ExtensionRequestDTO } from "@/types/extension-request.dto";
import { TaskRequestDTO } from "@/types/task-request.dto";
import { TaskDTO } from "@/types/task.dto";
import { UserData } from "@/types/user.dto";
import { create } from "zustand";

export interface GithubIssue {
  [key: string]: any;
}

// User interface replaced with UserData from types/user.dto.ts

interface UserStatus {
  data: {
    currentStatus: {
      state: string;
      from: number;
      until: number;
      message: string;
    };
  };
}

interface UserStore {
  userData: UserData | null;
  tasks: TaskDTO[]; // Updated to use TaskDTO
  allTasks: TaskDTO[]; // All tasks from tasks API
  hasMoreTasks: boolean;
  tasksNext: string;
  loadingTasks: boolean; // Separate loading state for tasks
  selectedAssignee: string | null; // Currently selected assignee for filtering
  searchResults: UserData[]; // Search results for users
  loadingSearch: boolean; // Loading state for user search
  userStatus: UserStatus | null; // Add userStatus property
  extensionRequests: ExtensionRequestDTO[];
  hasMoreExtensionRequests: boolean;
  extensionRequestsFilter: string;
  extensionRequestsNext: string;
  taskRequests: TaskRequestDTO[];
  hasMoreTaskRequests: boolean;
  taskRequestsFilter: string;
  taskRequestsNext: string;
  loading: boolean;
  error: string | null;
  fetchUsers: (cookie: string) => Promise<void>;
  fetchActiveTask: (cookie: string) => Promise<void>;
  fetchTasks: (
    cookie: string,
    next?: string,
    assignee?: string
  ) => Promise<void>;
  searchUsers: (cookie: string, searchTerm: string) => Promise<void>;
  setSelectedAssignee: (assignee: string | null) => void;
  clearSearchResults: () => void;
  fetchUserStatus: (cookie: string) => Promise<void>; // Add fetchUserStatus method
  fetchExtensionRequests: (
    cookie: string,
    status?: string,
    next?: string
  ) => Promise<void>;
  approveExtensionRequest: (id: string, cookie: string) => Promise<void>;
  rejectExtensionRequest: (
    id: string,
    cookie: string,
    reason?: string
  ) => Promise<void>;
  setExtensionRequestsFilter: (status: string) => void;
  fetchTaskRequests: (
    cookie: string,
    status?: string,
    next?: string
  ) => Promise<void>;
  approveTaskRequest: (id: string, cookie: string) => Promise<void>;
  rejectTaskRequest: (
    id: string,
    cookie: string,
    reason?: string
  ) => Promise<void>;
  setTaskRequestsFilter: (status: string) => void;
  submitOOOForm: (
    data: { fromDate: string; toDate: string; description: string },
    token: string
  ) => Promise<any>; // Add submitOOOForm
  cancelOOO: (token: string) => Promise<any>; // Add cancelOOO
}

export const useUserStore = create<UserStore>((set) => ({
  userData: null,
  tasks: [], // Updated to use TaskDTO[]
  allTasks: [], // Initialize allTasks as empty array
  hasMoreTasks: false,
  tasksNext: "",
  loadingTasks: false, // Initialize loadingTasks as false
  selectedAssignee: null, // Initialize selectedAssignee as null
  searchResults: [], // Initialize searchResults as empty array
  loadingSearch: false, // Initialize loadingSearch as false
  userStatus: null, // Initialize userStatus as null
  extensionRequests: [],
  hasMoreExtensionRequests: false,
  extensionRequestsFilter: "PENDING",
  extensionRequestsNext: "",
  taskRequests: [],
  hasMoreTaskRequests: false,
  taskRequestsFilter: "PENDING",
  taskRequestsNext: "",
  loading: false,
  error: null,

  fetchUsers: async (cookie: string) => {
    set({ loading: true });
    try {
      const response = await fetch(USER_API.USER_DETAIL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: `rds-session=${cookie}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.statusText}`);
      }

      const data = await response.json();
      set({ userData: data, loading: false, error: null });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to fetch users",
        loading: false,
      });
    }
  },

  fetchActiveTask: async (cookie: string) => {
    set({ loading: true });
    try {
      const response = await fetch(USER_API.GET_ACTIVE_TASK, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",
          Cookie: `rds-session=${cookie}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch active tasks: ${response.statusText}`);
      }

      const data: TaskDTO[] = await response.json(); // Use TaskDTO type
      set({ tasks: data, loading: false, error: null });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch active tasks",
        loading: false,
      });
    }
  },

  fetchUserStatus: async (cookie: string) => {
    set({ loading: true });
    try {
      const response = await fetch(USER_API.GET_USER_STATUS, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: `rds-session=${cookie}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch user status: ${response.statusText}`);
      }

      const data = await response.json();
      set({ userStatus: data, loading: false, error: null });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch user status",
        loading: false,
      });
    }
  },

  fetchTasks: async (cookie: string, next?: string, assignee?: string) => {
    console.log("fetchTasks called with next:", next, "assignee:", assignee);
    set({ loadingTasks: true });
    try {
      let url = TASK_API.GET_TASKS;
      if (assignee) {
        url += `&assignee=${encodeURIComponent(assignee)}`;
      }
      if (next) {
        // The next parameter is already a full path, so we need to extract just the cursor value
        const nextParam = next.includes("next=")
          ? next.split("next=")[1]
          : next;
        url += `&next=${encodeURIComponent(nextParam)}`;
      }

      console.log("Fetching tasks from URL:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",
          "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
          Cookie: `rds-session=${cookie}`,
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch tasks: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log("Raw API response:", JSON.stringify(data, null, 2));
      console.log("Tasks API response:", {
        tasksCount: data.tasks?.length || 0,
        hasNext: !!data.next,
        next: data.next,
        fullResponse: data,
      });

      const newTasks = data.tasks || [];
      console.log("New tasks to add:", newTasks.length);

      if (newTasks.length === 0 && next) {
        console.log(
          "⚠️ No new tasks returned for pagination - might be end of data"
        );
      }

      set((state) => {
        console.log(
          "Current allTasks length before update:",
          state.allTasks.length
        );
        const updatedState = {
          allTasks: next ? [...state.allTasks, ...newTasks] : newTasks,
          hasMoreTasks: !!data.next,
          tasksNext: data.next || "",
          loadingTasks: false,
          error: null,
        };
        console.log("Updated state:", {
          totalTasks: updatedState.allTasks.length,
          hasMoreTasks: updatedState.hasMoreTasks,
          tasksNext: updatedState.tasksNext,
        });
        return updatedState;
      });
    } catch (error) {
      console.error("Error fetching tasks:", error);
      set({
        error: error instanceof Error ? error.message : "Failed to fetch tasks",
        loadingTasks: false,
      });
    }
  },

  searchUsers: async (cookie: string, searchTerm: string) => {
    console.log("searchUsers called with searchTerm:", searchTerm);
    set({ loadingSearch: true });
    try {
      const url = `${USER_API.SEARCH_USERS}?search=${encodeURIComponent(
        searchTerm
      )}&size=5`;
      console.log("Searching users from URL:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",
          "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
          Cookie: `rds-session=${cookie}`,
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to search users: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log("User search response:", {
        usersCount: data.users?.length || 0,
        fullResponse: data,
      });

      const users = data.users || [];
      set({
        searchResults: users,
        loadingSearch: false,
        error: null,
      });
    } catch (error) {
      console.error("Error searching users:", error);
      set({
        error:
          error instanceof Error ? error.message : "Failed to search users",
        loadingSearch: false,
      });
    }
  },

  setSelectedAssignee: (assignee: string | null) => {
    console.log("setSelectedAssignee called with:", assignee);
    set({ selectedAssignee: assignee });
  },

  clearSearchResults: () => {
    console.log("clearSearchResults called");
    set({ searchResults: [], selectedAssignee: null });
  },

  submitOOOForm: async (data, token) => {
    const payload = {
      currentStatus: {
        from: new Date(data.fromDate).getTime(), // Convert fromDate to timestamp
        until: new Date(data.toDate).getTime(), // Convert toDate to timestamp
        message: data.description, // Map description to message
        state: "OOO", // Set state to OOO
        updatedAt: Date.now(), // Add updated timestamp
      },
    };

    const options = {
      method: "PATCH", // Use PATCH as per backend requirements
      headers: {
        "Content-Type": "application/json",
        cookie: `rds-session=${token}`, // Include the session token for authentication
      },
      body: JSON.stringify(payload),
    };

    try {
      const response = await fetch(HomeApi.UPDATE_STATUS, options);

      if (response.ok) {
        const responseData = await response.json();
        return responseData; // Return the response data
      } else {
        const errorData = await response.json();
        console.error("Error response from server:", errorData);
        throw new Error(`Failed to update status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error in submitOOOForm:", error);
      throw error; // Re-throw the error to handle it in the calling function
    }
  },

  cancelOOO: async (token) => {
    const payload = {
      cancelOoo: true, // Backend requires this field to cancel OOO
    };

    const options = {
      method: "PATCH", // Use PATCH as per backend requirements
      headers: {
        "Content-Type": "application/json",
        cookie: `rds-session=${token}`, // Include the session token for authentication
      },
      body: JSON.stringify(payload), // Send the required payload
    };

    try {
      const response = await fetch(HomeApi.CANCEL_STATUS, options); // Use CANCEL_STATUS API

      if (response.ok) {
        const responseData = await response.json();
        return responseData; // Return the response data
      } else {
        const errorData = await response.json();
        console.error("Error response from server:", errorData);
        throw new Error(`Failed to cancel OOO status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error in cancelOOO:", error);
      throw error; // Re-throw the error to handle it in the calling function
    }
  },

  fetchExtensionRequests: async (
    cookie: string,
    status = "PENDING",
    next?: string
  ) => {
    set({ loading: true });
    try {
      const queryParams = new URLSearchParams({
        order: "desc",
        size: "5",
        q: `status:${status}`,
      });

      if (next) {
        queryParams.append("next", next);
      }

      const url = `${EXTENSION_REQUEST_API.GET_EXTENSION_REQUESTS}?${queryParams}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",
          "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
          Cookie: `rds-session=${cookie}`,
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch extension requests: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      const newRequests = data.allExtensionRequests || [];

      set((state) => ({
        extensionRequests: next
          ? [...state.extensionRequests, ...newRequests]
          : newRequests,
        hasMoreExtensionRequests: !!data.next,
        extensionRequestsNext: data.next || "",
        loading: false,
        error: null,
      }));
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch extension requests",
        loading: false,
      });
    }
  },

  approveExtensionRequest: async (id: string, cookie: string) => {
    try {
      const response = await fetch(
        EXTENSION_REQUEST_API.UPDATE_EXTENSION_REQUEST_STATUS(id),
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Cookie: `rds-session=${cookie}`,
          },
          body: JSON.stringify({ status: "APPROVED" }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to approve extension request: ${response.statusText}`
        );
      }

      // Update the request status in the store
      set((state) => ({
        extensionRequests: state.extensionRequests.map((req) =>
          req.id === id ? { ...req, status: "APPROVED" } : req
        ),
      }));
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to approve extension request",
      });
      throw error;
    }
  },

  rejectExtensionRequest: async (
    id: string,
    cookie: string,
    reason?: string
  ) => {
    try {
      const response = await fetch(
        EXTENSION_REQUEST_API.UPDATE_EXTENSION_REQUEST_STATUS(id),
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Cookie: `rds-session=${cookie}`,
          },
          body: JSON.stringify({
            status: "DENIED",
            ...(reason && { reason }),
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to reject extension request: ${response.statusText}`
        );
      }

      // Update the request status in the store
      set((state) => ({
        extensionRequests: state.extensionRequests.map((req) =>
          req.id === id ? { ...req, status: "REJECTED" } : req
        ),
      }));
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to reject extension request",
      });
      throw error;
    }
  },

  setExtensionRequestsFilter: (status: string) => {
    set({ extensionRequestsFilter: status });
  },

  fetchTaskRequests: async (
    cookie: string,
    status = "PENDING",
    next?: string
  ) => {
    set({ loading: true });
    try {
      // Handle "ALL" case - don't add status filter
      let url;
      if (status === "ALL") {
        url = `${TASK_REQUEST_API.GET_TASK_REQUESTS}?size=20&q=sort%3Acreated-desc`;
      } else {
        // Convert status to lowercase
        const lowercaseStatus = status.toLowerCase();
        url = `${TASK_REQUEST_API.GET_TASK_REQUESTS}?size=20&q=status%3A${lowercaseStatus}++sort%3Acreated-desc`;
      }

      if (next) {
        url += `&next=${encodeURIComponent(next)}`;
      }
      console.log("Task requests API URL:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",
          "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36",
          Referer: "https://dashboard.realdevsquad.com/",
          Origin: "https://dashboard.realdevsquad.com",
          "sec-ch-ua-platform": '"macOS"',
          "sec-ch-ua":
            '"Google Chrome";v="141", "Not?A_Brand";v="8", "Chromium";v="141"',
          "sec-ch-ua-mobile": "?0",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-site",
          priority: "u=1, i",
          Cookie: `rds-session=${cookie}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Task requests API error:", {
          status: response.status,
          statusText: response.statusText,
          url: url,
          errorBody: errorText,
        });
        throw new Error(
          `Failed to fetch task requests: ${response.status} ${response.statusText} - ${errorText}`
        );
      }

      const data = await response.json();
      const newRequests = data.data || [];

      set((state) => ({
        taskRequests: next
          ? [...state.taskRequests, ...newRequests]
          : newRequests,
        hasMoreTaskRequests: !!data.next,
        taskRequestsNext: data.next || "",
        loading: false,
        error: null,
      }));
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch task requests",
        loading: false,
      });
    }
  },

  approveTaskRequest: async (id: string, cookie: string) => {
    try {
      const response = await fetch(
        TASK_REQUEST_API.UPDATE_TASK_REQUEST_STATUS(id),
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Cookie: `rds-session=${cookie}`,
          },
          body: JSON.stringify({ status: "APPROVED" }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to approve task request: ${response.statusText}`
        );
      }

      // Update the request status in the store
      set((state) => ({
        taskRequests: state.taskRequests.map((req) =>
          req.id === id ? { ...req, status: "APPROVED" } : req
        ),
      }));
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to approve task request",
      });
      throw error;
    }
  },

  rejectTaskRequest: async (id: string, cookie: string, reason?: string) => {
    try {
      const response = await fetch(
        TASK_REQUEST_API.UPDATE_TASK_REQUEST_STATUS(id),
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Cookie: `rds-session=${cookie}`,
          },
          body: JSON.stringify({
            status: "REJECTED",
            ...(reason && { reason }),
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to reject task request: ${response.statusText}`
        );
      }

      // Update the request status in the store
      set((state) => ({
        taskRequests: state.taskRequests.map((req) =>
          req.id === id ? { ...req, status: "REJECTED" } : req
        ),
      }));
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to reject task request",
      });
      throw error;
    }
  },

  setTaskRequestsFilter: (status: string) => {
    set({ taskRequestsFilter: status });
  },
}));
