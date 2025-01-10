/**
 * hooks/useTrialMetadata.ts
 *
 * Fetches metadata about the study data model from GET /studies/metadata
 * This endpoint returns an array of field definitions with name, description, type, etc.
 *
 * Example shape (simplified):
 * [
 *   {
 *     "name": "protocolSection",
 *     "description": "ProtocolSection node containing ...",
 *     "type": "ProtocolSection",
 *     ...
 *   },
 *   ...
 * ]
 */

import { useEffect, useState } from "react";
import api from "../services/api";

export interface FieldMetaData {
  name: string;
  description: string;
  type: string;
  // You can add more fields if needed from the docs
}

const useTrialMetadata = () => {
  const [metadata, setMetadata] = useState<FieldMetaData[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * fetchMetadata - calls /studies/metadata
   */
  const fetchMetaData = async () => {
    setLoading(true);
    setError(null);
    try {
      // GET /studies/metadata
      const response = await api.get("/studies/metadata");
      if (Array.isArray(response.data)) {
        setMetadata(response.data);
      } else {
        throw new Error("Metadata is not an array.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch metadata.");
      setMetadata(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetaData();
  }, []);

  return { metadata, loading, error };
};

export default useTrialMetadata;
