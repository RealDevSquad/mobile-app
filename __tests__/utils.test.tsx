import {
    buildUrl,
    formatDateTime,
    getLocalStorageItem,
    removeLocalStorageItem,
    setLocalStorageItem,
} from "@/common/utils/common";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));

// Mock console.error to avoid cluttering test output
const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

describe("formatDateTime", () => {
  it("formats valid timestamp (ms)", () => {
    const dateStr = formatDateTime(1704067200000); // Jan 1, 2024
    expect(dateStr).toBe("January 1, 2024");
  });

  it("formats valid timestamp (s)", () => {
    const dateStr = formatDateTime(1704067200); // Jan 1, 2024 in seconds
    expect(dateStr).toBe("January 1, 2024");
  });

  it("returns 'Invalid date' for falsy input", () => {
    expect(formatDateTime("")).toBe("Invalid date");
  });
});

describe("AsyncStorage utilities", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    consoleSpy.mockClear();
  });

  describe("getLocalStorageItem", () => {
    it("gets an item from local storage", async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue("test-token");
      const value = await getLocalStorageItem("TOKEN_KEY");
      expect(AsyncStorage.getItem).toHaveBeenCalledWith("TOKEN_KEY");
      expect(value).toBe("test-token");
    });

    it("handles error when getting item from local storage", async () => {
      const error = new Error("Storage error");
      (AsyncStorage.getItem as jest.Mock).mockRejectedValue(error);
      
      const value = await getLocalStorageItem("TOKEN_KEY");
      
      expect(AsyncStorage.getItem).toHaveBeenCalledWith("TOKEN_KEY");
      expect(value).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error getting item with key "TOKEN_KEY":',
        error
      );
    });
  });

  describe("setLocalStorageItem", () => {
    it("sets an item in local storage", async () => {
      await setLocalStorageItem("TOKEN_KEY", "1234");
      expect(AsyncStorage.setItem).toHaveBeenCalledWith("TOKEN_KEY", "1234");
    });

    it("handles error when setting item in local storage", async () => {
      const error = new Error("Storage error");
      (AsyncStorage.setItem as jest.Mock).mockRejectedValue(error);
      
      await setLocalStorageItem("TOKEN_KEY", "1234");
      
      expect(AsyncStorage.setItem).toHaveBeenCalledWith("TOKEN_KEY", "1234");
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error setting item with key "TOKEN_KEY":',
        error
      );
    });
  });

  describe("removeLocalStorageItem", () => {
    it("removes an item from local storage", async () => {
      await removeLocalStorageItem("TOKEN_KEY");
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith("TOKEN_KEY");
    });

    it("handles error when removing item from local storage", async () => {
      const error = new Error("Storage error");
      (AsyncStorage.removeItem as jest.Mock).mockRejectedValue(error);
      
      await removeLocalStorageItem("TOKEN_KEY");
      
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith("TOKEN_KEY");
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error removing item with key "TOKEN_KEY":',
        error
      );
    });
  });
});

describe("buildUrl", () => {
  it("constructs a URL with query params", () => {
    const url = buildUrl("https://api.example.com/user", {
      id: "123",
      name: "Adity Dev",
    });

    expect(url).toBe("https://api.example.com/user?id=123&name=Adity%20Dev");
  });
});

// Clean up console spy after all tests
afterAll(() => {
  consoleSpy.mockRestore();
});