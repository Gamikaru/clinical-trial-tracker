/**
 * hooks/useFieldValues.ts
 *
 * Fetches distribution of values for given fields from GET /stats/field/values
 * The endpoint can be filtered by "types" (ENUM, STRING, DATE, etc.) and by "fields".
 *
 * Example response shape (simplified):
 * [
 *   {
 *     "field": "Condition",
 *     "piece": "conditionList",
 *     "type": "ENUM",
 *     "missingStudiesCount": 10,
 *     "topValues": [
 *       { value: "Diabetes", studiesCount: 200 },
 *       ...
 *     ],
 *     "uniqueValuesCount": 50
 *   }
 * ]
 */

import { useEffect, useState } from "react";
import axios from "../services/api";

interface TopValue {
  value: string;
  studiesCount: number;
}

interface FieldValue {
  field: string;
  piece: string;
  type: string;
  missingStudiesCount: number;
  topValues: TopValue[];
  uniqueValuesCount: number;
}

const useFieldValues = (types: string[], fields: string[]) => {
  const [fieldValues, setFieldValues] = useState<FieldValue[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * fetchFieldValues - calls /stats/field/values
   * 'types' can be [ENUM, STRING, ...], 'fields' must specify which pieces or field paths we want stats for.
   */
  const fetchFieldValues = async () => {
    setLoading(true);
    setError(null);
    try {
      // GET /stats/field/values
      // We pass { types, fields } as query params
      const response = await axios.get("/stats/field/values", {
        params: { types, fields },
      });
      setFieldValues(response.data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch field values.");
      setFieldValues(null);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Re-fetch whenever 'types' or 'fields' changes
   */
  useEffect(() => {
    if (types.length && fields.length) {
      fetchFieldValues();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(types), JSON.stringify(fields)]);

  return { fieldValues, loading, error };
};

export default useFieldValues;
