import { useState, useEffect } from "react";

const STORAGE_KEY = "ccc-cookie-notice-acknowledged";
const CURRENT_VERSION = "1.0";

interface CookieNoticeData {
  acknowledged: boolean;
  timestamp: number;
  version: string;
}

/**
 * Hook to manage cookie banner visibility and acknowledgment state
 * Stores user acknowledgment in localStorage to prevent showing banner again
 */
export const useCookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check localStorage on mount
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data: CookieNoticeData = JSON.parse(stored);
        // Check if version matches current version
        // If version changes, we can re-show the banner
        if (data.acknowledged && data.version === CURRENT_VERSION) {
          setIsVisible(false);
        } else {
          setIsVisible(true);
        }
      } else {
        // No stored data, show banner
        setIsVisible(true);
      }
    } catch (error) {
      // If localStorage fails, show banner to be safe
      console.warn("Failed to read cookie banner state:", error);
      setIsVisible(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const acknowledge = () => {
    try {
      const data: CookieNoticeData = {
        acknowledged: true,
        timestamp: Date.now(),
        version: CURRENT_VERSION,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setIsVisible(false);
    } catch (error) {
      console.warn("Failed to save cookie banner acknowledgment:", error);
      // Still hide the banner even if storage fails
      setIsVisible(false);
    }
  };

  return {
    isVisible: isVisible && !isLoading,
    acknowledge,
  };
};

