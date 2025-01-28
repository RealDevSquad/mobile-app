import React from 'react';
import { Provider as StoreProvider } from 'react-redux';
import { store } from '../../../../../RDS_Projects/mobile-app/App';
import { AuthProvider } from '../../../../../RDS_Projects/mobile-app/src/context/AuthContext';

interface ProviderWrapperProps {
  children: JSX.Element;
}

const ProviderWrapper: React.FC<ProviderWrapperProps> = ({ children }) => (
  <StoreProvider store={store}>
    <AuthProvider>{children}</AuthProvider>
  </StoreProvider>
);

export default ProviderWrapper;
