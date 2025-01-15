import axios from "axios";
import { useEffect, useState } from "react";

interface GeoStatsData {
    totalStudies: number;
    countryCounts: Record<string, number>;
}

const useGeoStats = (condition: string, latitude: number, longitude: number, radius: string) => {
    const [data, setData] = useState<GeoStatsData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchGeoStats = async () => {
            try {
                const response = await axios.get(`/api/geo-stats`, {
                    params: { condition, latitude, longitude, radius },
                });
                setData(response.data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchGeoStats();
    }, [condition, latitude, longitude, radius]);

    return { data, loading, error };
};

export default useGeoStats;