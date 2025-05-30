import { getLocalStorageItem } from "@/common/utils/common";
import { renderHook, waitFor } from '@testing-library/react-native';
import useCheckUserSession from "../hooks/getUserToken";

jest.mock("@/common/utils/common", () => ({
  getLocalStorageItem: jest.fn(),
}));

describe("useCheckUserSession", () => {
  it("returns token from localStorage", async () => {
    const mockToken = "mocked_token_123";
    (getLocalStorageItem as jest.Mock).mockResolvedValue(mockToken);

    const { result } = renderHook(() => useCheckUserSession());

    await waitFor(() => {
      expect(result.current.token).toBe(mockToken);
    });
  });

  it("returns null when no token exists", async () => {
    (getLocalStorageItem as jest.Mock).mockResolvedValue(null);

    const { result } = renderHook(() => useCheckUserSession());

    await waitFor(() => {
      expect(result.current.token).toBeNull();
    });
  });

  it("handles error when fetching token", async () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    (getLocalStorageItem as jest.Mock).mockRejectedValue(new Error("fail"));

    const { result } = renderHook(() => useCheckUserSession());

    await waitFor(() => {
      expect(result.current.token).toBeNull();
    });

    expect(errorSpy).toHaveBeenCalledWith("Error getting token:", expect.any(Error));
    errorSpy.mockRestore();
  });
});
