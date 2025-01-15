// src/hooks/useEnrollmentInsights.ts
import { useEffect, useState } from "react";
import api from "../services/api";

interface EnrollmentInsights {
  average_enrollment: number;
  total_enrollment: number;
  enrollment_distribution: Record<string, number>;
}

const useEnrollmentInsights = () => {
  const [data, setData] = useState<EnrollmentInsights | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEnrollmentInsights = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log("[useEnrollmentInsights] Fetching enrollment insights");
        const response = await api.get("/api/enrollment-insights");
        console.log("[useEnrollmentInsights] Response:", response.data);
        setData(response.data);
      } catch (err: any) {
        console.error("[useEnrollmentInsights] Error:", err);
        setError(err.message || "Failed to fetch enrollment insights.");
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollmentInsights();
  }, []);

  return { data, loading, error };
};

export default useEnrollmentInsights;
