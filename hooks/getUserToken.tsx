import { getLocalStorageItem } from "@/common/utils/common";
import { TOKEN_KEY } from "@/constants/constants";
import { useEffect, useState } from "react";

export default function useCheckUserSession() {
  const [token, setToken] = useState<string | null>(null);

  const fetchToken = async () => {
    try {
      const storedToken = await getLocalStorageItem(TOKEN_KEY);
      setToken(storedToken);
      return storedToken;
    } catch (error) {
      console.error("Error getting token:", error);
      return null;
    }
  };

  useEffect(() => {
    fetchToken();
  }, []);

  return { token, refetchToken: fetchToken };
}
