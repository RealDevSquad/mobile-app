import { create } from 'zustand';

// Modal state interface
interface ModalState {
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
}

// UI state interface
interface UIState extends ModalState {
  // Actions
  setModal: (modal: keyof ModalState, visible: boolean) => void;
  closeAllModals: () => void;
  openModal: (modal: keyof ModalState) => void;
  closeModal: (modal: keyof ModalState) => void;
}

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

// Specific modal hooks for convenience
export const useOOOModal = () =>
  useUIStore((state) => ({
    isOpen: state.oooModal,
    open: () => state.setModal('oooModal', true),
    close: () => state.setModal('oooModal', false),
  }));

export const useSearchModal = () =>
  useUIStore((state) => ({
    isOpen: state.searchModal,
    open: () => state.setModal('searchModal', true),
    close: () => state.setModal('searchModal', false),
  }));

export const useExtensionModal = () =>
  useUIStore((state) => ({
    isOpen: state.extensionModal,
    open: () => state.setModal('extensionModal', true),
    close: () => state.setModal('extensionModal', false),
  }));

export const useUpdateStatusModal = () =>
  useUIStore((state) => ({
    isOpen: state.updateStatusModal,
    open: () => state.setModal('updateStatusModal', true),
    close: () => state.setModal('updateStatusModal', false),
  }));

export const useAddProgressModal = () =>
  useUIStore((state) => ({
    isOpen: state.addProgressModal,
    open: () => state.setModal('addProgressModal', true),
    close: () => state.setModal('addProgressModal', false),
  }));
