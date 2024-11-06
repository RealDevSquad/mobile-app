import React from 'react';
import { screen, render, fireEvent } from '@testing-library/react-native';
import AuthScreen from '../src/screens/AuthScreen/AuthScreen';
import Strings from '../src/i18n/en';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { Linking } from 'react-native';
import AuthApis from '../src/constants/apiConstant/AuthApi';
import ProviderWrapper from '../src/utils/tests/ProviderWrapper';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
  };
});

jest.mock('react-native/Libraries/Linking/Linking', () => ({
  openURL: jest.fn(() => Promise.resolve('mockResolve')),
  getInitialURL: jest.fn(() => Promise.resolve('mockResolve')),
  addEventListener: jest.fn(),
}));

it('AuthScreen is rendered', () => {
  render(
    <ProviderWrapper>
      <AuthScreen />
    </ProviderWrapper>,
  );
  screen.getByText(/welcome to/i);
  screen.getByText(/real dev squad/i);
});

it('Clicking on Sign in with Github opens browser', async () => {
  const mockBuildUrl = (url: string, params: { [key: string]: string }) => {
    const queryString = Object.keys(params)
      .map((key) => `${key}=${params[key]}`)
      .join('&');

    return `${url}?${queryString}`;
  };
  const queryParams = {
    sourceUtm: 'rds-mobile-app',
    redirectURL: 'https://realdevsquad.com/',
  };
  const baseUrl = AuthApis.GITHUB_AUTH_API;
  const githubUrl = mockBuildUrl(baseUrl, queryParams);

  render(
    <ProviderWrapper>
      <AuthScreen />
    </ProviderWrapper>,
  );

  const githubSignInBtn = screen.getByText(Strings.SIGN_IN_BUTTON_TEXT);
  fireEvent.press(githubSignInBtn);
  expect(Linking.openURL).toHaveBeenCalledTimes(1);
  expect(Linking.openURL).toHaveBeenCalledWith(githubUrl);
});

describe('AuthScreen', () => {
  const initialState = {
    localFeatureFlag: {
      isProdEnvironment: true,
    },
  };

  const mockReducer = (state = initialState) => state;
  const mockStore = configureStore({
    reducer: {
      localFeatureFlag: mockReducer,
    },
  });

  require('react-redux').useSelector.mockReturnValue({
    initialState,
  });

  test('Activate Camera when Camera button is pressed', () => {
    const { getByText, queryByTestId } = render(
      <Provider store={mockStore}>
        <AuthScreen />
      </Provider>,
    );

    const cameraButton = getByText('Web SignIn');
    fireEvent.press(cameraButton);

    expect(queryByTestId('camera')).toBeTruthy();
  });
});
