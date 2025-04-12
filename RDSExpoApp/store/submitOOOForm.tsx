import { create } from 'zustand';
import { HomeApi } from '../constants/apiConstant/HomeApi';

interface OOOFormState {
  submitOOOForm: (data: { fromDate: string; toDate: string; description: string }, token: string) => Promise<any>;
  cancelOOO: (token: string) => Promise<any>; // Add cancelOOO function
}

export const useOOOStore = create<OOOFormState>((set, get) => ({
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