// src/hooks/useTimeStats.ts
import { useEffect, useState } from "react";
import api from "../services/api";

interface TimeStats {
  totalStudies: number;
  yearBreakdown: Record<string, number>;
}

const useTimeStats = (condition: string, start_year: number) => {
  const [data, setData] = useState<TimeStats | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTimeStats = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log("[useTimeStats] Fetching time stats for:", { condition, start_year });
        const response = await api.get("/api/time-stats", {
          params: { condition, start_year },
        });
        console.log("[useTimeStats] Response:", response.data);
        setData(response.data);
      } catch (err: any) {
        console.error("[useTimeStats] Error:", err);
        setError(err.message || "Failed to fetch time statistics.");
      } finally {
        setLoading(false);
      }
    };

    fetchTimeStats();
  }, [condition, start_year]);

  return { data, loading, error };
};

export default useTimeStats;
