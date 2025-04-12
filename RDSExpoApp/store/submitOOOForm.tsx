import { create } from 'zustand';
import { HomeApi } from '../constants/apiConstant/HomeApi';

interface OOOFormState {
  submitOOOForm: (data: { fromDate: string; toDate: string; description: string }, token: string) => Promise<any>;
}

export const useOOOStore = create<OOOFormState>((set, get) => ({
  submitOOOForm: async (data, token) => {
    console.log('Submitting OOO Form Data:', data);

    const options = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        cookie: `rds-session=${token}`, // Include the session token for authentication
      },
      body: JSON.stringify(data),
    };

    try {
      // Make a PATCH request to update the user's status using HomeApi.UPDATE_STATUS
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
}));