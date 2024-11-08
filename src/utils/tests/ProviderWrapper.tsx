import React from 'react';
import { Provider as StoreProvider } from 'react-redux';
import { AuthProvider } from '../../context/AuthContext';
import { store } from '../../../App';

interface ProviderWrapperProps {
  children: JSX.Element;
}

const ProviderWrapper: React.FC<ProviderWrapperProps> = ({ children }) => (
  <StoreProvider store={store}>
    <AuthProvider>{children}</AuthProvider>
  </StoreProvider>
);

export default ProviderWrapper;
