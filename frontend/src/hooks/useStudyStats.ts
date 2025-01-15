/**
 * src/hooks/useStudyStats.ts
 *
 * Example: calls GET /api/stats/size from your local Python backend
 */

import { useEffect, useState } from "react";
import api from "../services/api";

interface StudyStats {
    totalCount: number;
    averageSizeBytes: number;
    largestStudies: Array<{ id: string; sizeBytes: number }>;
}

const useStudyStats = () => {
    const [stats, setStats] = useState<StudyStats | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            setError(null);
            console.log("[useStudyStats] Calling GET /api/stats/size");
            try {
                const response = await api.get("/api/stats/size");
                setStats(response.data);
            } catch (err: any) {
                console.error("[useStudyStats] Error:", err);
                setError(err.message || "Failed to fetch study stats.");
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    return { stats, loading, error };
};

export default useStudyStats;
