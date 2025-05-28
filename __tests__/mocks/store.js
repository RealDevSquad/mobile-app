export const mockFetchUserStatus = jest.fn();
export const mockSubmitOOOForm = jest.fn();
export const mockCancelOOO = jest.fn();

export const useUserStore = jest.fn(() => ({
  fetchUserStatus: mockFetchUserStatus,
  userStatus: { data: { currentStatus: { state: "ACTIVE" } } },
  submitOOOForm: mockSubmitOOOForm,
  cancelOOO: mockCancelOOO,
  loading: false,
}));