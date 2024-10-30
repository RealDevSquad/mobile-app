import {
  getUserData,
  isValidTextInput,
  unixToTimeStamp,
  updateMarkYourSelfAs_,
  updateStatus,
} from '../src/screens/AuthScreen/Util';
import { urls } from '../src/constants/appConstant/url';
import { fetchUserRequest } from '../src/sagas/handlers/user';
import { fetchUserData } from '../src/sagas/requests/fetchUser';
import { call, put } from 'redux-saga/effects';
import Strings from '../src/i18n/en';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('getUserData util', () => {
  const token = '12345421ac1aca';
  const invalidToken = 'a1b9c2d8x3y7z4';

  const mockUserData = {
    id: '123abc',
    github_display_name: 'Jane Doe',
    picture: { url: 'https://via.placeholder.com/600/d32776' },
    status: Strings.OOOStatus_Text,
    token: '12345421ac1aca',
    github_id: 'anishpawaskar',
    twitter_id: 'anish',
    username: 'anish-pawaskar',
  };

  test('when token passed is invalid, axios call returns with 401', async () => {
    const errorResponse = {
      response: {
        status: 401,
        data: {
          message: 'Unauthenticated User',
        },
      },
    };
    mockedAxios.get.mockRejectedValue(errorResponse);
    try {
      await getUserData(invalidToken);
    } catch (err) {
      expect(err).toEqual({
        response: {
          status: 401,
          data: {
            message: 'Unauthenticated User',
          },
        },
      });
    }
  });

  test('when token is passed to getUserData && axios call is ok return user name & profileUrl', async () => {
    mockedAxios.get.mockResolvedValue({ data: mockUserData });
    const res = await getUserData(token);
    expect(mockedAxios.get).toHaveBeenCalledWith(`${urls.GET_USERS_DATA}`, {
      headers: {
        'Content-Type': 'application/json',
        Cookie: `rds-session=${token}`,
      },
    });
    expect(res).toEqual({
      id: '123abc',
      name: 'Jane Doe',
      profileUrl: 'https://via.placeholder.com/600/d32776',
      status: Strings.OOOStatus_Text,
      token: '12345421ac1aca',
      github_id: 'anishpawaskar',
      twitter_id: 'anish',
      username: 'anish-pawaskar',
    });
  });

  test('when token is passed to getUserData && axios call fails return null', async () => {
    mockedAxios.get.mockRejectedValue('500: server error');
    try {
      await getUserData(token);
    } catch (err) {
      expect(err).toEqual('500: server error');
    }
  });
});

describe('updateStatus util', () => {
  test('pass arg undefined receive throw error', async () => {
    mockedAxios.patch.mockRejectedValue(
      // eslint-disable-next-line quotes
      `TypeError: Cannot read properties of undefined (reading 'protocol')`,
    );
    try {
      /* @ts-expect-error */
      await updateStatus(undefined);
    } catch (err) {
      expect(err).toEqual(
        // eslint-disable-next-line quotes
        `TypeError: Cannot read properties of undefined (reading 'protocol')`,
      );
    }
  });

  test('passes url to get changed status', async () => {
    mockedAxios.patch.mockResolvedValue({
      config: { data: { status: Strings.Active_Text } },
    });

    try {
      const res = await updateStatus(Strings.Active_Text);
      expect(res).toEqual(Strings.Active_Text);
    } catch (err) {}
  });

  test('passes url to receive thrown error', async () => {
    mockedAxios.patch.mockRejectedValue('500: internal server error');

    try {
      await updateStatus(Strings.Active_Text);
    } catch (err) {
      expect(err).toEqual('500: internal server error');
    }
  });
});

describe('updateMarkYourSelfAs_ util', () => {
  test('pass arg undefined receive throw error', async () => {
    mockedAxios.patch.mockRejectedValue(
      // eslint-disable-next-line quotes
      `TypeError: Cannot read properties of undefined (reading 'protocol')`,
    );
    try {
      /* @ts-expect-error */
      await updateMarkYourSelfAs_(undefined);
    } catch (err) {
      expect(err).toEqual(
        // eslint-disable-next-line quotes
        `TypeError: Cannot read properties of undefined (reading 'protocol')`,
      );
    }
  });

  test('passes url to get changed status', async () => {
    mockedAxios.patch.mockResolvedValue({
      data: { status: Strings.Active_Text },
    });

    try {
      const res = await updateMarkYourSelfAs_(Strings.Active_Text);
      expect(res).toEqual(Strings.Active_Text);
    } catch (err) {}
  });

  test('passes url to receive thrown error', async () => {
    mockedAxios.patch.mockRejectedValue('500: internal server error');

    try {
      await updateMarkYourSelfAs_(Strings.Active_Text);
    } catch (err) {
      expect(err).toEqual('500: internal server error');
    }
  });
});

test('check is otpcode of valid format', () => {
  expect(isValidTextInput('')).toBeTruthy();
  expect(isValidTextInput('1234')).toBeTruthy();
  expect(isValidTextInput('abcd')).toBeFalsy();
  expect(isValidTextInput('AB12')).toBeFalsy();
  expect(isValidTextInput('1%2B')).toBeFalsy();
});

describe('fetchUserRequest', () => {
  const action = { type: 'GET_USER', payload: 'lDaUIVTP4sXRwPWh3Gn4' };
  const generator = fetchUserRequest(action);

  test('should call fetchUserData', () => {
    expect(generator.next().value).toEqual(call(fetchUserData, action.payload));
  });

  test('should dispatch FETCH_USER action', () => {
    const user = {
      company: 'Deloitte',
      designation: 'Frontend Developer',
      githubUrl: 'https://twitter.combharati-21',
      linkedInUrl: 'https://www.linkedin.com/in/bharati-subramanian-29734b152',
      name: 'Bharati Subramanian',
      profileUrl:
        'https://res.cloudinary.com/realdevsquad/image/upload/v1687759892/profile/lDaUIVTP4sXRwPWh3Gn4/sqaq4clqiprmdwu2lyjk.jpg',
      twitterUrl: 'https://github.com/_bhaaratii',
      userName: 'bharati',
    };
    expect(generator.next(user).value).toEqual(
      put({ type: 'FETCH_USER', user }),
    );
  });

  test('should dispatch FETCH_USER_ERROR action on error', () => {
    const error = new Error('Something went wrong');
    expect(generator.throw(error).value).toEqual(
      put({ type: 'FETCH_USER_ERROR', message: error.message }),
    );
  });

  test('should be done', () => {
    expect(generator.next().done).toBe(true);
  });
  test('unixToTimeStamp function should return NA if no date is supplied', () => {
    expect(unixToTimeStamp('')).toBe('NA');
  });
  test('unixToTimeStamp function should return date in dd-mm-yyyy format on passing seconds', () => {
    expect(unixToTimeStamp('1700000000')).toBe('14-11-2023');
  });
});
