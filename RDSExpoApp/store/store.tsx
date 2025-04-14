import { HomeApi } from '@/constants/apiConstant/home-api';
import { USER_API } from '@/constants/apiConstant/user-api';
import { TaskDTO } from '@/types/task.dto';
import { create } from 'zustand';

export interface GithubIssue {
  [key: string]: any;
}

interface User {
  id: number;
  name: string;
  email: string;
  address: { city: string };
}

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
  userData: User[];
  tasks: TaskDTO[]; // Updated to use TaskDTO
  userStatus: UserStatus | null; // Add userStatus property
  loading: boolean;
  error: string | null;
  fetchUsers: (cookie: string) => Promise<void>;
  fetchActiveTask: (cookie: string) => Promise<void>;
  fetchUserStatus: (cookie: string) => Promise<void>; // Add fetchUserStatus method
  submitOOOForm: (data: { fromDate: string; toDate: string; description: string }, token: string) => Promise<any>; // Add submitOOOForm
  cancelOOO: (token: string) => Promise<any>; // Add cancelOOO
}

export const useUserStore = create<UserStore>((set) => ({
  userData: [],
  tasks: [], // Updated to use TaskDTO[]
  userStatus: null, // Initialize userStatus as null
  loading: false,
  error: null,

  fetchUsers: async (cookie: string) => {
    set({ loading: true });
    try {
      const response = await fetch(USER_API.USER_DETAIL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
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
        error: error instanceof Error ? error.message : 'Failed to fetch users',
        loading: false,
      });
    }
  },

  fetchActiveTask: async (cookie: string) => {
    set({ loading: true });
    try {
      const response = await fetch(USER_API.GET_ACTIVE_TASK, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          accept: '*/*',
          'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8,hi;q=0.7',
          origin: 'https://my.realdevsquad.com',
          referer: 'https://my.realdevsquad.com/',
          'user-agent':
            'Mozilla/5.0 (X11; Linux aarch64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36 CrKey/1.54.250320',
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
            : 'Failed to fetch active tasks',
        loading: false,
      });
    }
  },

  fetchUserStatus: async (cookie: string) => {
    set({ loading: true });
    try {
      const response = await fetch(USER_API.GET_USER_STATUS, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
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
            : 'Failed to fetch user status',
        loading: false,
      });
    }
  },

  submitOOOForm: async (data, token) => {
    console.log('Submitting OOO Form Data:', data);

    const payload = {
      currentStatus: {
        from: new Date(data.fromDate).getTime(), // Convert fromDate to timestamp
        until: new Date(data.toDate).getTime(), // Convert toDate to timestamp
        message: data.description, // Map description to message
        state: 'OOO', // Set state to OOO
        updatedAt: new Date().getTime(), // Add updated timestamp
      },
    };

    const options = {
      method: 'PATCH', // Use PATCH as per backend requirements
      headers: {
        'Content-Type': 'application/json',
        cookie: `rds-session=${token}`, // Include the session token for authentication
      },
      body: JSON.stringify(payload),
    };

    try {
      const response = await fetch(HomeApi.UPDATE_STATUS, options);

      if (response.ok) {
        const responseData = await response.json();
        console.log('Status updated successfully:', responseData);
        return responseData; // Return the response data
      } else {
        const errorData = await response.json();
        console.error('Error response from server:', errorData);
        throw new Error(`Failed to update status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error in submitOOOForm:', error);
      throw error; // Re-throw the error to handle it in the calling function
    }
  },

  cancelOOO: async (token) => {
    console.log('Cancelling OOO Status');

    const payload = {
      cancelOoo: true, // Backend requires this field to cancel OOO
    };

    const options = {
      method: 'PATCH', // Use PATCH as per backend requirements
      headers: {
        'Content-Type': 'application/json',
        cookie: `rds-session=${token}`, // Include the session token for authentication
      },
      body: JSON.stringify(payload), // Send the required payload
    };

    try {
      const response = await fetch(HomeApi.CANCEL_STATUS, options); // Use CANCEL_STATUS API

      if (response.ok) {
        const responseData = await response.json();
        console.log('OOO status cancelled successfully:', responseData);
        return responseData; // Return the response data
      } else {
        const errorData = await response.json();
        console.error('Error response from server:', errorData);
        throw new Error(`Failed to cancel OOO status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error in cancelOOO:', error);
      throw error; // Re-throw the error to handle it in the calling function
    }
  },
}));