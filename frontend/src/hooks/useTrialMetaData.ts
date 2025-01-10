import { useEffect, useState } from "react";
import axios from "../services/api";

/**
 * FieldMetadata interface defines the structure of study metadata.
 */
interface FieldMetadata {
  name: string;
  description: string;
  type: string;
  // Add other properties as needed
}

/**
 * useTrialMetadata hook fetches metadata for clinical trials.
 * @returns metadata data, loading state, and error message
 */
const useTrialMetadata = () => {
  const [metadata, setMetadata] = useState<FieldMetadata[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMetadata = async () => {
    setLoading(true);
    setError(null);
    try {
      // ...existing code...
      const response = await axios.get("/studies/metadata");
      // { changed code: replaced "/metadata-endpoint" with "/studies/metadata" }
      // ...existing code...
      if (Array.isArray(response.data)) {
        setMetadata(response.data);
      } else {
        throw new Error("Metadata is not an array");
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch metadata.");
      setMetadata(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetadata();
  }, []);

  return { metadata, loading, error };
};

export default useTrialMetadata;
