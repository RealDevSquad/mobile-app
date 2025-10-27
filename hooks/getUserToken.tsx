import { useAuthActions, useAuthToken } from '@/store/authStore';
import { useEffect } from 'react';

/**
 * Hook to check user session using Zustand auth store.
 * Replaces the old AsyncStorage-based implementation with encrypted storage.
 *
 * @deprecated Use useAuthToken() and useAuthActions() directly for better performance
 */
export default function useCheckUserSession() {
  const token = useAuthToken();
  const { initialize } = useAuthActions();

  useEffect(() => {
    // Initialize auth store on first use
    initialize();
  }, [initialize]);

  return {
    token,
    refetchToken: initialize,
  };
}
