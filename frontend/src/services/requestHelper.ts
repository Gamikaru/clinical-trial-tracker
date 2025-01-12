/**
 * services/requestHelper.ts
 *
 * Optional: Illustrates how to wrap axios calls for additional error handling.
 */

import api from "./api";

/**
 * A generic GET request helper using the configured axios instance.
 * @param {string} url - The endpoint to call (e.g. "/api/filtered-studies").
 * @param {Record<string, any>} params - Query parameters or filters.
 */
export async function getRequest(
  url: string,
  params: Record<string, any> = {}
) {
  console.log("[getRequest] Making GET request to:", url, "with params:", params);
  const response = await api.get(url, { params });
  return response.data;
}

/**
 * A generic POST request helper.
 */
export async function postRequest(
  url: string,
  data: Record<string, any> = {},
  params: Record<string, any> = {}
) {
  console.log("[postRequest] Making POST request to:", url, "with data:", data);
  const response = await api.post(url, data, { params });
  return response.data;
}
