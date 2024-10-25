import React from 'react';
import { screen, render, fireEvent } from '@testing-library/react-native';
import AuthScreen from '../src/screens/AuthScreen/AuthScreen';
import Strings from '../src/i18n/en';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { customRenderWithProvider } from '../src/utils/tests';

it('AuthScreen is rendered', () => {
  customRenderWithProvider(AuthScreen);
  screen.getByText(/welcome to/i);
  screen.getByText(/real dev squad/i);
});

it.skip('Clicking on Sign in with Github shows a toast', async () => {
  render(
    <>
      <AuthScreen />
      <Toast />
    </>,
  );
  const githubSignInBtn = screen.getByText(Strings.SIGN_IN_BUTTON_TEXT);
  fireEvent.press(githubSignInBtn);
  screen.getByText(/Sign in with GitHub coming soon/i);
});
