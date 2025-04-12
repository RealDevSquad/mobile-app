import moment from 'moment';
import { create } from 'zustand';
import { HomeApi } from '../constants/apiConstant/HomeApi';

interface OOOFormState {
  submitOOOForm: (data: { fromDate: string; toDate: string; description: string }, token: string) => Promise<any>;
}

export const useOOOStore = create<OOOFormState>((set, get) => ({
  submitOOOForm: async (data, token) => {
    console.log('Submitting OOO Form Data:', data);

    console.log('Submitting new Date:',  new Date(data.fromDate).getTime() );

    const from = moment(data.fromDate).format('DD-MM-YYYY');
    const fromTms = moment(data.fromDate).format("X");

    const to = moment(data.toDate).format('DD-MM-YYYY');
    const toTms = moment(data.toDate).format("X");

    const updated = moment(new Date()).format('DD-MM-YYYY');
    const updatedTms = moment(new Date()).format("X");

    

    // Convert frontend fields to backend-compatible fields
    const payload = {
      currentStatus:{
        from: new Date(data.fromDate).getTime(), // Convert fromDate to ISO date string
        until: new Date(data.toDate).getTime(), // Convert toDate to ISO date string
        message: data.description, // Map description to message
        state: 'OOO', // Set state to PENDING
        updatedAt: new Date().getTime(),
       
      
    }
  }

    

    const options = {
      method: 'PATCH', // Use PATCH as per backend requirements
      headers: {
        'Content-Type': 'application/json',
        cookie: `rds-session=${token}`, // Include the session token for authentication
      },
      body: JSON.stringify(payload),
    };

    try {
      // Make a PATCH request to create the OOO status request
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