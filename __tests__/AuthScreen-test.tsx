import React from 'react';
import { screen, render, fireEvent } from '@testing-library/react-native';
import AuthScreen from '../src/screens/AuthScreen/AuthScreen';
import Strings from '../src/i18n/en';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { customRenderWithProvider } from '../src/utils/tests';
import { Linking } from 'react-native';

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
  customRenderWithProvider(AuthScreen);
  screen.getByText(/welcome to/i);
  screen.getByText(/real dev squad/i);
});

it('Clicking on Sign in with Github opens browser', async () => {
  customRenderWithProvider(AuthScreen);

  const githubSignInBtn = screen.getByText(Strings.SIGN_IN_BUTTON_TEXT);
  fireEvent.press(githubSignInBtn);
  expect(Linking.openURL).toHaveBeenCalledTimes(1);
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
