// src/hooks/useGeoStats.ts
import { useEffect, useState } from "react";
import api from "../services/api";

interface GeoStats {
  totalStudies: number;
  countryCounts: Record<string, number>;
}

const useGeoStats = (
  condition: string,
  latitude: number,
  longitude: number,
  radius: string
) => {
  const [data, setData] = useState<GeoStats | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGeoStats = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log("[useGeoStats] Fetching geo stats for:", { condition, latitude, longitude, radius });
        const response = await api.get("/api/geo-stats", {
          params: { condition, latitude, longitude, radius },
        });
        console.log("[useGeoStats] Response:", response.data);
        setData(response.data);
      } catch (err: any) {
        console.error("[useGeoStats] Error:", err);
        setError(err.message || "Failed to fetch geo statistics.");
      } finally {
        setLoading(false);
      }
    };

    // Fetch when dependencies change
    fetchGeoStats();
  }, [condition, latitude, longitude, radius]);

  return { data, loading, error };
};

export default useGeoStats;
