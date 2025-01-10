import axios from "axios";

// Create the axios instance with a baseURL from your .env or fallback
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "https://clinicaltrials.gov/api/v2",
    headers: {
        "Content-Type": "application/json",
    },

    // Custom parameter serializer to handle nesting of query.* and filter.* objects,
    // plus turning `fields` array into a single comma-separated param.
    paramsSerializer: (params) => {
        const searchParams = new URLSearchParams();

        console.log("Starting params serialization");
        console.log("Initial params:", params);

        // Flatten nested objects like { query: { cond: "value" } } and handle arrays properly.
        Object.keys(params || {}).forEach((key) => {
            const value = params[key];
            console.log(`Processing key: ${key}, value:`, value);

            // Handle location parameter
            if (key === "location" && value?.latitude && value?.longitude && value?.radius) {
                // Turn "location" into filter.geo => "distance(latitude, longitude, radius)"
                const { latitude, longitude, radius } = value;
                const geoParam = `distance(${latitude},${longitude},${radius})`;
                searchParams.append("filter.geo", geoParam);
                console.log(`Appended geo filter: ${geoParam}`);
            }

            // Handle status parameter
            else if (key === "status" && Array.isArray(value)) {
                // Turn statuses array into repeated filter.overallStatus
                // e.g. filter.overallStatus=RECRUITING&filter.overallStatus=COMPLETED
                value.forEach((stat) => {
                    searchParams.append("filter.overallStatus", stat);
                    console.log(`Appended status filter: ${stat}`);
                });
            }

            // 1) If `key === "fields"` and `value` is an array => join with commas.
            //    This solves the 400 error from multiple repeated ?fields= usage.
            else if (key === "fields" && Array.isArray(value)) {
                // E.g. ["NCTId","BriefTitle"] => "NCTId,BriefTitle"
                searchParams.append("fields", value.join(","));
                console.log(`Appended fields: ${value.join(",")}`);
            }

            // 2) If the value is a nested object, flatten sub-keys, e.g. query.cond
            else if (
                typeof value === "object" &&
                value !== null &&
                !Array.isArray(value)
            ) {
                // Flatten each subKey, e.g. query.cond => ?query.cond=...
                Object.keys(value).forEach((subKey) => {
                    searchParams.append(`${key}.${subKey}`, value[subKey]);
                    console.log(`Appended nested key: ${key}.${subKey}, value: ${value[subKey]}`);
                });
            }

            // 3) If it’s an array (but NOT fields), we treat them as repeated params
            //    e.g. filter.overallStatus=RECRUITING & filter.overallStatus=COMPLETED
            else if (Array.isArray(value)) {
                value.forEach((arrVal) => {
                    searchParams.append(key, arrVal);
                    console.log(`Appended array key: ${key}, value: ${arrVal}`);
                });
            }

            // 4) Otherwise, treat it as a simple param if not undefined/null
            else if (value !== undefined && value !== null) {
                searchParams.append(key, value);
                console.log(`Appended simple key: ${key}, value: ${value}`);
            }
        });

        const serializedParams = searchParams.toString();
        console.log("Serialized params:", serializedParams);

        return serializedParams;
    },
});

export default api;
