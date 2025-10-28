import '@testing-library/jest-native/extend-expect';
import { Alert as ReactNativeAlert } from 'react-native';
import 'react-native-gesture-handler/jestSetup';

// ---- Mock react-native-encrypted-storage ----
jest.mock('react-native-encrypted-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
}));

// ---- Mock Zustand stores ----
jest.mock('@/store/authStore', () => ({
  useAuthStore: jest.fn(() => ({
    token: null,
    user: null,
    isAuthenticated: false,
    isLoading: false,
    setToken: jest.fn(),
    setUser: jest.fn(),
    login: jest.fn(),
    logout: jest.fn(),
    initialize: jest.fn(() => Promise.resolve()),
    clearLoading: jest.fn(),
  })),
  useAuthToken: jest.fn(() => null),
  useAuthUser: jest.fn(() => null),
  useIsAuthenticated: jest.fn(() => false),
  useAuthLoading: jest.fn(() => false),
  useAuthActions: jest.fn(() => ({
    setToken: jest.fn(),
    setUser: jest.fn(),
    login: jest.fn(),
    logout: jest.fn(),
    initialize: jest.fn(() => Promise.resolve()),
    clearLoading: jest.fn(),
  })),
}));

jest.mock('@/store/uiStore', () => ({
  useUIStore: jest.fn(() => ({
    oooModal: false,
    searchModal: false,
    extensionModal: false,
    extensionDetailsModal: false,
    updateStatusModal: false,
    addProgressModal: false,
    taskRequestModal: false,
    profileModal: false,
    isAnyModalOpen: false,
    setModal: jest.fn(),
    closeAllModals: jest.fn(),
    openModal: jest.fn(),
    closeModal: jest.fn(),
  })),
  useModalState: jest.fn(() => false),
  useIsAnyModalOpen: jest.fn(() => false),
  useUIActions: jest.fn(() => ({
    setModal: jest.fn(),
    openModal: jest.fn(),
    closeModal: jest.fn(),
    closeAllModals: jest.fn(),
  })),
  useOOOModal: jest.fn(() => ({
    isOpen: false,
    open: jest.fn(),
    close: jest.fn(),
  })),
  useSearchModal: jest.fn(() => ({
    isOpen: false,
    open: jest.fn(),
    close: jest.fn(),
  })),
  useExtensionModal: jest.fn(() => ({
    isOpen: false,
    open: jest.fn(),
    close: jest.fn(),
  })),
  useUpdateStatusModal: jest.fn(() => ({
    isOpen: false,
    open: jest.fn(),
    close: jest.fn(),
  })),
  useAddProgressModal: jest.fn(() => ({
    isOpen: false,
    open: jest.fn(),
    close: jest.fn(),
  })),
}));

jest.mock('@react-native-async-storage/async-storage', () =>
  jest.requireActual(
    '@react-native-async-storage/async-storage/jest/async-storage-mock'
  )
);

// ---- Mock for @expo/vector-icons ----
interface IoniconsProps {
  // Keep interface definition
  name: string;
  size?: number;
  color?: string;
  testID?: string;
  [key: string]: any;
}

jest.mock('@expo/vector-icons', () => {
  const React = jest.requireActual('react');
  const { View } = jest.requireActual('react-native');

  const MockIonicons: React.FC<IoniconsProps> = (props) =>
    React.createElement(View, { ...props, testID: props.testID || 'icon' });
  return {
    Ionicons: MockIonicons,
  };
});

// ---- Mock React Native Alert ----
jest.spyOn(ReactNativeAlert, 'alert');

// ---- Mock React Native Linking ----
export const mockLinkingOpenURL = jest.fn();
export const mockLinkingCanOpenURL = jest.fn(() => Promise.resolve(true));
export const mockLinkingGetInitialURL = jest.fn(() => Promise.resolve(null));
export const mockLinkingAddEventListener = jest.fn();
export const mockLinkingRemoveEventListener = jest.fn();
