import { getLocalStorageItem } from "@/common/utils/common";
import { TOKEN_KEY } from "@/constants/constants";
import { useEffect, useState } from "react";

export default function useCheckUserSession() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const getToken = async () => {
      try {
        const storedToken = await getLocalStorageItem(TOKEN_KEY);
        setToken(storedToken); // Set the token once retrieved
      } catch (error) {
        console.error("Error getting token:", error);
      }
    };

    getToken();
  }, []);
  return { token }; // Only return the token
}
