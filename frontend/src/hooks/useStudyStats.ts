// frontend/src/hooks/useStudyStats.ts
import { useEffect, useState } from "react";
import axios from "../services/api";

interface StudyStats {
  totalCount: number;
  averageSizeBytes: number;
  largestStudies: Array<{ id: string; sizeBytes: number }>;
  // other fields...
}

const useStudyStats = () => {
  const [stats, setStats] = useState<StudyStats | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      // Corrected endpoint
      const response = await axios.get("/stats/size");
      setStats(response.data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch statistics.");
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return { stats, loading, error };
};

export default useStudyStats;
