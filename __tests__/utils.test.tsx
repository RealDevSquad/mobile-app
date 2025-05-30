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
  });

  it("gets an item from local storage", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue("test-token");
    const value = await getLocalStorageItem("TOKEN_KEY");
    expect(AsyncStorage.getItem).toHaveBeenCalledWith("TOKEN_KEY");
    expect(value).toBe("test-token");
  });

  it("sets an item in local storage", async () => {
    await setLocalStorageItem("TOKEN_KEY", "1234");
    expect(AsyncStorage.setItem).toHaveBeenCalledWith("TOKEN_KEY", "1234");
  });

  it("removes an item from local storage", async () => {
    await removeLocalStorageItem("TOKEN_KEY");
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith("TOKEN_KEY");
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
