// Store exports - centralized entry point for all Zustand stores

// Auth store exports
export {
  useAuthActions,
  useAuthStore,
  useAuthToken,
  useAuthUser,
  useIsAuthenticated,
  type User,
} from './authStore';

// UI store exports
export {
  useAddProgressModal,
  useExtensionModal,
  useIsAnyModalOpen,
  useModalState,
  useOOOModal,
  useSearchModal,
  useUIActions,
  useUIStore,
  useUpdateStatusModal,
} from './uiStore';

// Store types
export type { AuthState } from './authStore';
export type { ModalState, UIState } from './uiStore';
