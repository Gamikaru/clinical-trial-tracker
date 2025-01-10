/**
 * hooks/useVersion.ts
 *
 * Fetches version info for the data set from GET /version.
 * The response typically includes something like:
 * {
 *   "version": "v2.0.0",
 *   "dataTimestamp": "2025-04-01T12:34:56Z"
 * }
 */

import { useEffect, useState } from "react";
import axios from "../services/api";

interface VersionInfo {
  version: string;
  dataTimestamp: string;
}

const useVersion = () => {
  const [version, setVersion] = useState<VersionInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * fetchVersion - calls /version
   */
  const fetchVersion = async () => {
    setLoading(true);
    setError(null);
    try {
      // GET /version
      const response = await axios.get("/version");
      setVersion(response.data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch version info.");
      setVersion(null);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch on mount
   */
  useEffect(() => {
    fetchVersion();
  }, []);

  return { version, loading, error };
};

export default useVersion;
