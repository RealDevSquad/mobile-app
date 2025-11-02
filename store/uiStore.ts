import { useCallback } from 'react';
import { create } from 'zustand';

// Modal state type
export type ModalState = {
  // Home screen modals
  oooModal: boolean;

  // Tasks screen modals
  searchModal: boolean;

  // My Tasks screen modals
  extensionModal: boolean;
  extensionDetailsModal: boolean;
  updateStatusModal: boolean;
  addProgressModal: boolean;

  // Task Requests screen modals
  taskRequestModal: boolean;

  // Profile screen modals
  profileModal: boolean;

  // Generic modal state
  isAnyModalOpen: boolean;
};

// UI state type
export type UIState = ModalState & {
  // Actions
  setModal: (modal: keyof ModalState, visible: boolean) => void;
  closeAllModals: () => void;
  openModal: (modal: keyof ModalState) => void;
  closeModal: (modal: keyof ModalState) => void;
};

// Initial modal state
const initialModalState: ModalState = {
  oooModal: false,
  searchModal: false,
  extensionModal: false,
  extensionDetailsModal: false,
  updateStatusModal: false,
  addProgressModal: false,
  taskRequestModal: false,
  profileModal: false,
  isAnyModalOpen: false,
};

export const useUIStore = create<UIState>((set, get) => ({
  ...initialModalState,

  setModal: (modal, visible) => {
    set((state) => {
      const newState = { ...state, [modal]: visible };

      // Update isAnyModalOpen based on all modal states
      const isAnyOpen = Object.keys(newState).some((key) => {
        if (key === 'isAnyModalOpen') return false;
        return newState[key as keyof ModalState] === true;
      });

      return {
        ...newState,
        isAnyModalOpen: isAnyOpen,
      };
    });
  },

  openModal: (modal) => {
    get().setModal(modal, true);
  },

  closeModal: (modal) => {
    get().setModal(modal, false);
  },

  closeAllModals: () => {
    set((state) => ({
      ...state,
      ...initialModalState,
    }));
  },
}));

// Selector hooks for better performance
export const useModalState = (modal: keyof ModalState) =>
  useUIStore((state) => state[modal]);

export const useIsAnyModalOpen = () =>
  useUIStore((state) => state.isAnyModalOpen);

export const useUIActions = () =>
  useUIStore((state) => ({
    setModal: state.setModal,
    openModal: state.openModal,
    closeModal: state.closeModal,
    closeAllModals: state.closeAllModals,
  }));

// Specific modal hooks for convenience - Fixed to prevent infinite re-renders
// These hooks now use separate selectors and memoized callbacks

export const useOOOModal = () => {
  const isOpen = useUIStore((state) => state.oooModal);
  const openModal = useUIStore((state) => state.openModal);
  const closeModal = useUIStore((state) => state.closeModal);

  const open = useCallback(() => openModal('oooModal'), [openModal]);
  const close = useCallback(() => closeModal('oooModal'), [closeModal]);

  return {
    isOpen,
    open,
    close,
  };
};

export const useSearchModal = () => {
  const isOpen = useUIStore((state) => state.searchModal);
  const openModal = useUIStore((state) => state.openModal);
  const closeModal = useUIStore((state) => state.closeModal);

  const open = useCallback(() => openModal('searchModal'), [openModal]);
  const close = useCallback(() => closeModal('searchModal'), [closeModal]);

  return {
    isOpen,
    open,
    close,
  };
};

export const useExtensionModal = () => {
  const isOpen = useUIStore((state) => state.extensionModal);
  const openModal = useUIStore((state) => state.openModal);
  const closeModal = useUIStore((state) => state.closeModal);

  const open = useCallback(() => openModal('extensionModal'), [openModal]);
  const close = useCallback(() => closeModal('extensionModal'), [closeModal]);

  return {
    isOpen,
    open,
    close,
  };
};

export const useUpdateStatusModal = () => {
  const isOpen = useUIStore((state) => state.updateStatusModal);
  const openModal = useUIStore((state) => state.openModal);
  const closeModal = useUIStore((state) => state.closeModal);

  const open = useCallback(() => openModal('updateStatusModal'), [openModal]);
  const close = useCallback(
    () => closeModal('updateStatusModal'),
    [closeModal]
  );

  return {
    isOpen,
    open,
    close,
  };
};

export const useAddProgressModal = () => {
  const isOpen = useUIStore((state) => state.addProgressModal);
  const openModal = useUIStore((state) => state.openModal);
  const closeModal = useUIStore((state) => state.closeModal);

  const open = useCallback(() => openModal('addProgressModal'), [openModal]);
  const close = useCallback(() => closeModal('addProgressModal'), [closeModal]);

  return {
    isOpen,
    open,
    close,
  };
};
