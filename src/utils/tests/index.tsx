import React from 'react';
import { Provider as StoreProvider } from 'react-redux';
import { AuthProvider } from '../../context/AuthContext';
import { store } from '../../../App';
import {
  render,
  RenderOptions,
  RenderResult,
} from '@testing-library/react-native';
import Toast from 'react-native-toast-message';

export function customRenderWithProvider(
  Component: React.FC<unknown>,
  renderOptions?: RenderOptions,
): RenderResult {
  return render(
    <StoreProvider store={store}>
      <AuthProvider>
        <Component />
      </AuthProvider>
    </StoreProvider>,
    renderOptions,
  );
}

export const withToast = (Component: React.FC<unknown>) => {
  return () => (
    <>
      <Component />
      <Toast />
    </>
  );
};
