/**
 * hooks/useStudyStats.ts
 *
 * Updated so we read `totalStudies` from the JSON and store it in `totalCount`.
 * That way, your component code (which expects stats.totalCount) will now display the correct number.
 */
import { useEffect, useState } from "react";
import api from "../services/api";

interface StudyStats {
    totalCount: number; // We'll store totalStudies here
    averageSizeBytes: number;
    largestStudies: Array<{ id: string; sizeBytes: number }>;
    // other fields as needed (percentiles, ranges, etc.)
}

const useStudyStats = () => {
    const [stats, setStats] = useState<StudyStats | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchStats = async () => {
        console.log("Fetching study stats...");
        setLoading(true);
        setError(null);
        try {
            // GET /stats/size
            const response = await api.get("/stats/size");
            console.log("API response:", response);

            // The official API returns 'totalStudies', we rename it to 'totalCount'
            const rawData = response.data;
            console.log("Raw data:", rawData);

            const normalizedData: StudyStats = {
                totalCount: rawData.totalStudies || 0,
                averageSizeBytes: rawData.averageSizeBytes,
                largestStudies: rawData.largestStudies || [],
            };
            console.log("Normalized data:", normalizedData);

            setStats(normalizedData);
        } catch (err: any) {
            console.error("Error fetching stats:", err);
            setError(err.message || "Failed to fetch statistics.");
            setStats(null);
        } finally {
            setLoading(false);
            console.log("Loading state set to false");
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    return { stats, loading, error };
};

export default useStudyStats;
