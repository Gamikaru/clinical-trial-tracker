import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://clinicaltrials.gov/api/v2",
  headers: {
    "Content-Type": "application/json",
  },
  paramsSerializer: (params) => {
    const searchParams = new URLSearchParams();
    Object.keys(params).forEach((key) => {
      if (typeof params[key] === "object" && params[key] !== null) {
        Object.keys(params[key]).forEach((subKey) => {
          searchParams.append(`${key}.${subKey}`, params[key][subKey]);
        });
      } else {
        searchParams.append(key, params[key]);
      }
    });
    return searchParams.toString();
  },
});

export const getStudies = (params: any) => api.get("/studies", { params });
export const getStudyById = (nctId: string) => api.get(`/studies/${nctId}`);
export const getMetadata = () => api.get("/studies/metadata");
export const getStudySizes = () => api.get("/stats/size");

export default api;
