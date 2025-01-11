/**
 * services/requestHelper.ts (Optional)
 *
 * Example file illustrating how you could wrap axios calls for additional
 * error handling, interceptors, or specialized logging. This is not mandatory.
 *
 * Usage example in  hooks:
 *    import { getRequest } from '../services/requestHelper';
 *    ...
 *    const response = await getRequest('/studies', { query: { cond: 'cancer' } });
 */

import api from "./api";

/**
 * A generic GET request helper using  configured axios instance.
 * @param {string} url - The endpoint to call, e.g. "/studies"
 * @param {Record<string, any>} params - Query parameters or filters
 */
export async function getRequest(
  url: string,
  params: Record<string, any> = {}
) {
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
  const response = await api.post(url, data, { params });
  return response.data;
}

/**
 * Similarly, you can define putRequest, deleteRequest, etc. as needed.
 */
