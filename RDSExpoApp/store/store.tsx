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

interface UserStore {
  userData: User[];
  tasks: TaskDTO[]; // Updated to use TaskDTO
  loading: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
  fetchActiveTask: () => Promise<void>;
}

export const useUserStore = create<UserStore>((set) => ({
  userData: [],
  tasks: [], // Updated to use TaskDTO[]
  loading: false,
  error: null,
  fetchUsers: async () => {
    set({ loading: true });
    try {
      const response = await fetch(USER_API.USER_DETAIL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': 'rds-session=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ4ekZNVWhwVUJlVUVZaEpTRExkaiIsImlhdCI6MTc0MzkyODEyNCwiZXhwIjoxNzQ2NTIwMTI0fQ.gvYegdQkt7-ZsTNM22oskm_8z5JiduxrxCzu7aWXG6lH7kkpaYJRCSvc8BHagQWdb9MmmTY1_hPBnfpwyyg505IH_Se66H8rolQ_qtbKQmyK5lDl78ciMKOg1yP98COhoE4KpQeSSm3nUYxXPqP4-zo_RX-xEXwXrjXKgri9n4hQT-KBI9rVdk9Nd0vUesTt_NlwrLydfkGVFXn8FkkYvc3u4WugrvQiMSVafOuKEklYjHLwXCEn2guGoC4YP7qJEEhmak-w31L_WhEvrRPsGXjglcC8JTOOZXGl0-nK9c9t2prPn7Rj5Q1bO-sUBgqgWi9EDGkaaDYYx-J9X6LWYg',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.statusText}`);
      }

      const data = await response.json();
      set({ userData: data, loading: false, error: null });
    } catch (error) {
      set({ error: (error instanceof Error ? error.message : 'Failed to fetch users'), loading: false });
    }
  },
  fetchActiveTask: async () => {
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
          'user-agent': 'Mozilla/5.0 (X11; Linux aarch64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36 CrKey/1.54.250320',
          Cookie: 'rds-session=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ4ekZNVWhwVUJlVUVZaEpTRExkaiIsImlhdCI6MTc0MzkyODEyNCwiZXhwIjoxNzQ2NTIwMTI0fQ.gvYegdQkt7-ZsTNM22oskm_8z5JiduxrxCzu7aWXG6lH7kkpaYJRCSvc8BHagQWdb9MmmTY1_hPBnfpwyyg505IH_Se66H8rolQ_qtbKQmyK5lDl78ciMKOg1yP98COhoE4KpQeSSm3nUYxXPqP4-zo_RX-xEXwXrjXKgri9n4hQT-KBI9rVdk9Nd0vUesTt_NlwrLydfkGVFXn8FkkYvc3u4WugrvQiMSVafOuKEklYjHLwXCEn2guGoC4YP7qJEEhmak-w31L_WhEvrRPsGXjglcC8JTOOZXGl0-nK9c9t2prPn7Rj5Q1bO-sUBgqgWi9EDGkaaDYYx-J9X6LWYg',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch active tasks: ${response.statusText}`);
      }

      const data: TaskDTO[] = await response.json(); // Use TaskDTO type
      set({ tasks: data, loading: false, error: null });
    } catch (error) {
      set({ error: (error instanceof Error ? error.message : 'Failed to fetch active tasks'), loading: false });
    }
  },
}));