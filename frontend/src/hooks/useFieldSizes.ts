/**
 * hooks/useFieldSizes.ts
 *
 * Fetches field sizes for list/array fields from GET /stats/field/sizes
 * This endpoint returns data about how many items appear in certain list fields,
 * e.g., how many conditions or interventions a study might have.
 *
 * Example response shape (simplified):
 * [
 *   {
 *     "field": "Condition",
 *     "piece": "conditionList",
 *     "minSize": 1,
 *     "maxSize": 14,
 *     "uniqueSizesCount": 4,
 *     "topSizes": [
 *       { "size": 1, "studiesCount": 100 },
 *       ...
 *     ]
 *   }
 * ]
 */

import { useEffect, useState } from "react";
import axios from "../services/api";

interface TopSize {
    size: number;
    studiesCount: number;
}

interface FieldSize {
    field: string;
    piece: string;
    minSize: number;
    maxSize: number;
    uniqueSizesCount: number;
    topSizes: TopSize[];
}

const useFieldSizes = (fields: string[]) => {
    const [fieldSizes, setFieldSizes] = useState<FieldSize[] | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * fetchFieldSizes - calls /stats/field/sizes
     * The 'fields' parameter is required by the endpoint to specify which fields we want stats for.
     */
    const fetchFieldSizes = async () => {
        setLoading(true);
        setError(null);
        console.debug("Fetching field sizes for fields:", fields);
        try {
            // GET /stats/field/sizes
            // params: { fields } => array of field paths or pieces
            const response = await axios.get("/stats/field/sizes", {
                params: { fields },
            });
            console.debug("Received response:", response.data);
            setFieldSizes(response.data);
        } catch (err: any) {
            console.error("Error fetching field sizes:", err);
            setError(err.message || "Failed to fetch field sizes.");
            setFieldSizes(null);
        } finally {
            setLoading(false);
            console.debug("Finished fetching field sizes");
        }
    };

    /**
     * Only fetch if we have at least one field
     */
    useEffect(() => {
        if (fields.length) {
            console.debug("Fields changed, fetching new field sizes");
            fetchFieldSizes();
        }
        // We include JSON.stringify(fields) so if 'fields' changes, we re-fetch
    }, [JSON.stringify(fields)]);

    return { fieldSizes, loading, error };
};

export default useFieldSizes;
