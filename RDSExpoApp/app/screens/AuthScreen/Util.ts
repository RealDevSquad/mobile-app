import axios from 'axios';
import moment from 'moment';
import { PermissionsAndroid } from 'react-native';
import GoalsApi from '../../../constants/apiConstant/GoalsApi';
import { HomeApi } from '../../../constants/apiConstant/HomeApi';
import { urls } from '../../../constants/appConstant/url';

export const getUserData = async (token: string) => {
  try {
    const res = await axios.get(urls.GET_USERS_DATA, {
      headers: {
        'Content-Type': 'application/json',
        Cookie: `rds-session=${token}`,
      },
    });
    return {
      id: res.data.id,
      name: res.data.github_display_name,
      profileUrl: res.data?.picture?.url,
      status: res.data?.status,
      twitter_id: res.data?.twitter_id,
      linkedin_id: res.data?.linkedin_id,
      github_id: res.data?.github_id,
      username: res?.data?.username,
      token: token,
    };
  } catch (e) {
    console.log('err', e);
  }
};

export const fetchContribution = async (userName: string): Promise<any> => {
  try {
    const response = await axios.get(urls.GET_CONTRIBUTIONS + userName, {
      headers: {
        cookie: '',
      },
    });
    return response.data;
  } catch (error) {
    return null;
  }
};

// export const fetchActiveContributions = async (id: string): Promise<any> => {
//   try {
//     const response = await axios.get(urls.GET_ACTIVE_TASK, {
//       headers: {
//         cookie: '',
//       },
//     });
//     return response.data;
//   } catch (error) {
//     return null;
//   }
// };
export const fetchAllTasks = async (token: string): Promise<any> => {
  try {
    const response = await axios.get(urls.GET_ALL_TASK, {
      headers: {
        cookie: `rds-session=${token}`,
      },
    });
    return response.data;
  } catch (error) {
    return null;
  }
};
export const fetchActiveTasks = async (token: string): Promise<any> => {
  try {
    const response = await axios.get(urls.GET_ACTIVE_TASK, {
      headers: {
        cookie: `rds-session=${token}`,
      },
    });
    return response.data;
  } catch (error) {
    return null;
  }
};

export const updateStatus = async (status: string) => {
  const res = await axios.patch(
    urls.GET_USERS_DATA,
    { status },
    {
      headers: {
        cookie: '',
      },
    },
  );
  return res.config.data.status;
};

export const updateMarkYourSelfAs_ = async (markStatus: string) => {
  const res = await axios.patch(
    urls.GET_USERS_DATA,
    { status: markStatus },
    {
      headers: {
        cookie: '',
      },
    },
  );

  return res.data.status;
};

export const goalsAuth = async (token: string): Promise<any> => {
  try {
    const response = await axios.get(urls.GOALS_AUTH, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // Use Authorization instead of Cookie
      },
    });
    return response.data;
  } catch (error) {
    return null;
  }
};
export const PostGoal = async (
  title: string,
  description: string,
  created_by: string,
  assigned_to: string,
  ends_on: string,
  assigned_by: string,
) => {
  try {
    const apiUrl = GoalsApi.POST_TODO_S;
    const goalData = {
      data: {
        type: 'Goal',
        attributes: {
          title: title,
          description: description,
          created_by: created_by,
          assigned_to: assigned_to,
          ends_on: ends_on,
          assigned_by: assigned_by,
        },
      },
    };

    const response = await axios.post(apiUrl, goalData, {
      headers: {
        'Content-Type': 'application/vnd.api+json',
        //  Authorization: `Bearer ${token}`, // Use Authorization instead of Cookie
      },
    });

    // Handle the response
    console.log('POST API response:', response.data);
    return response.data;
  } catch (error) {
    // Handle errors
    console.error('Error in POST API:', error.message);
  }
};

export const getUsersStatus = async (token) => {
  try {
    const res = await axios.get(HomeApi.GET_USER_STATUS, {
      headers: {
        'Content-type': 'application/json',
        cookie: `rds-session=${token}`,
      },
    });
    if (res.data.data.currentStatus) {
      return res?.data?.data?.currentStatus?.state;
    } else {
      return 'Something went wrong';
    }
  } catch (err) {
    return 'Something went wrong';
  }
};

export const getAllUsers = async (token) => {
  try {
    const res = await axios.get(HomeApi.GET_ALL_USERS, {
      headers: {
        'Content-type': 'application/json',
        cookie: `rds-session=${token}`,
      },
    });
    if (res?.data?.users) {
      return res?.data?.users;
    } else {
      return 'Something went wrong';
    }
  } catch (err) {
    return 'Something went wrong';
  }
};

export const submitOOOForm = async (data, token) => {
  console.log('data', data);
  const options = {
    headers: {
      'Content-type': 'application/json',
      cookie: `rds-session=${token}`,
    },
  };
  const body = data;
  try {
    const res = await axios.patch(HomeApi.UPDATE_STATUS, body, options);
    if (res.status === 200) {
      return res;
    }
  } catch (err) {
    console.log('error', err);
  }
};

export const cancelOoo = async (token) => {
  const options = {
    headers: {
      'Content-type': 'application/json',
      cookie: `rds-session=${token}`,
    },
  };
  const body = { cancelOoo: true };
  try {
    const res = await axios.patch(HomeApi.UPDATE_STATUS, body, options);
    if (res.status === 200) {
      console.log('response in cancelling', res);
      return res;
    } else {
      throw new Error('Api is failing');
    }
  } catch (err) {
    console.log('error', err);
  }
};

export const isValidTextInput = (code: string) =>
  Boolean(/^[\d]{1,4}$|^$/.test(code));

export const requestCameraPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: 'Accessing your camera to scan the QR code',
        message:
          'RDS App needs access to your camera ' + 'so you can scan QR code',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can use the camera');
    } else {
      console.log('Camera permission denied');
    }
  } catch (err) {
    console.warn(err);
  }
};
export const unixToTimeStamp = (_date) => {
  if (!_date) {
    return 'NA';
  }
  // Unix timestamp in seconds
  const timestamp = _date;

  // Create a new Date object using the timestamp
  const date = new Date(timestamp * 1000); // Multiply by 1000 to convert seconds to milliseconds

  // Get the components of the date
  const day = date.getDate();
  const month = date.getMonth() + 1; // Months are zero-indexed, so add 1
  const year = date.getFullYear();

  // Create a formatted date string
  const formattedDate = `${day < 10 ? '0' : ''}${day}-${
    month < 10 ? '0' : ''
  }${month}-${year}`;

  return formattedDate;
};
export const formatTimeToUnix = (date) => {
  const newDate = new Date(date);

  // Convert the date to Unix Epoch timestamp in seconds
  const unixTimestampInSeconds = newDate.getTime();
  return unixTimestampInSeconds;
};

export const convertTimestampToReadableDate = (timestamp) => {
  return new Date(timestamp * 1000);
};

export const calculateTimeDifference = (startDate, endDate) => {
  const timeDifference = endDate - startDate;
  const secondsInMillisecond = 1000;
  const minutesInMillisecond = 60 * secondsInMillisecond;
  const hoursInMillisecond = 60 * minutesInMillisecond;
  const daysInMillisecond = 24 * hoursInMillisecond;
  const weeksInMillisecond = 7 * daysInMillisecond;
  const monthsInMillisecond = 30.44 * daysInMillisecond; // Average month length
  const yearsInMillisecond = 365 * daysInMillisecond;

  if (timeDifference < minutesInMillisecond) {
    return `${Math.floor(timeDifference / secondsInMillisecond)} seconds`;
  } else if (timeDifference < hoursInMillisecond) {
    return `${Math.floor(timeDifference / minutesInMillisecond)} minutes`;
  } else if (timeDifference < daysInMillisecond) {
    return `${Math.floor(timeDifference / hoursInMillisecond)} hours`;
  } else if (timeDifference < weeksInMillisecond) {
    return `${Math.floor(timeDifference / daysInMillisecond)} days`;
  } else if (timeDifference < monthsInMillisecond) {
    return `${Math.floor(timeDifference / weeksInMillisecond)} weeks`;
  } else if (timeDifference < yearsInMillisecond) {
    return `${Math.floor(timeDifference / monthsInMillisecond)} months`;
  } else {
    return `${Math.floor(timeDifference / yearsInMillisecond)} years`;
  }
};

export const calculateISODateFormat = (isoDateString) => {
  const date = new Date(isoDateString);
  const formatDate = (d) => {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    const day = d.getDate();
    const monthIndex = d.getMonth();
    const year = d.getFullYear();

    return `${day} ${months[monthIndex]}, ${year}`;
  };
  const formattedDate = formatDate(date);
  return formattedDate;
};

export const parseISODate = (isoDateString) => {
  return new Date(isoDateString);
};

export const formatTimeAgo = (timestamp) => {
  const currentDate = moment();
  const endDate = moment.unix(timestamp);
  return endDate.from(currentDate);
};

export const fetchTaskDetails = async (
  taskId: String,
  token: string,
): Promise<any> => {
  console.log(
    'token and taskid',
    urls.GET_ALL_TASK + taskId + '/details',
    taskId,
  );
  try {
    const response = await axios.get(urls.GET_ALL_TASK + taskId + '/details', {
      headers: {
        'Content-type': 'application/json',
        cookie: `rds-session=${token}`,
      },
    });
    console.log(response.status);
    return response.data;
  } catch (error) {
    return null;
  }
};
export const fetchTaskProgressDetails = async (
  token: string,
  taskId: string,
): Promise<any> => {
  console.log('URL>>>', urls.GET_TASK_PROGRESS_DETAIL + taskId);
  try {
    const response = await axios.get(urls.GET_TASK_PROGRESS_DETAIL + taskId, {
      headers: {
        'Content-type': 'application/json',
        cookie: `rds-session=${token}`,
      },
    });

    if (!response.ok) {
      console.log('Error:', response.data);
      return response.data;
    } else {
      console.log('res>>', response.status);
      return response?.data;
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      // Handle 404 response here if needed
      // For example, you can return a specific error object or a default value
      return error.response.data;
    } else {
      console.log('Other Error:', error);
      // Handle other errors here
      return null;
    }
  }
};

export const overallTaskProgress = async (
  token: string,
  percentCompleted: number,
  taskId: string,
) => {
  const options = {
    headers: {
      'Content-type': 'application/json',
      cookie: `rds-session=${token}`,
    },
  };
  const body = { percentCompleted: percentCompleted };
  try {
    const res = await axios.patch(
      `${urls.GET_ACTIVE_TASK}/${taskId}?userStatusFlag=true`,
      body,
      options,
    );
    if (res.status === 200) {
      console.log('Task updated successfully!', res.data);
      return res.data;
    } else {
      throw new Error(`API Error: ${res.status} - ${res.statusText}`);
    }
  } catch (err) {
    console.error('API error:', err);
  }
};
