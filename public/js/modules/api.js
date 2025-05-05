// /public/js/modules/api.js

/**
 * API communication module for handling AJAX requests
 */

import { getToken } from './auth.js';

// Base API URL - adjust based on your environment
const BASE_URL = 'http://localhost:5000/api/v1';

/**
 * Make an authenticated API request
 * @param {string} endpoint - API endpoint (without base URL)
 * @param {Object} options - Fetch options
 * @returns {Promise} - Promise resolving to response data
 */
export async function apiRequest(endpoint, options = {}) {
  const url = `${BASE_URL}/${endpoint.replace(/^\//, '')}`;
  
  // Default headers
  const headers = {
    ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
    ...options.headers,
  };

  // Add auth token if available
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Build request options
  const requestOptions = {
    ...options,
    headers
  };

  try {
    const response = await fetch(url, requestOptions);
    
    // For 204 No Content responses
    if (response.status === 204) {
      return { success: true };
    }
    
    const data = await response.json();
    
    // Handle non-2xx status responses
    if (!response.ok) {
      throw new Error(data.message || `API error: ${response.status}`);
    }
    
    return data; 

  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
}

/**
 * GET request helper
 * @param {string} endpoint - API endpoint
 * @param {Object} params - Query parameters
 * @returns {Promise} - Promise resolving to response data
 */
export function get(endpoint, params = {}) {
  // Add query params if provided
  const queryString = Object.keys(params).length 
    ? '?' + new URLSearchParams(params).toString() 
    : '';
  
  return apiRequest(`${endpoint}${queryString}`, { method: 'GET' });
}

/**
 * POST request helper
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Request payload
 * @returns {Promise} - Promise resolving to response data
 */
export function post(endpoint, data = {}) {
  return apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

/**
 * PUT request helper
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Request payload
 * @returns {Promise} - Promise resolving to response data
 */
export function put(endpoint, data = {}) {
  return apiRequest(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

/**
 * PATCH request helper
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Request payload
 * @returns {Promise} - Promise resolving to response data
 */
export function patch(endpoint, data = {}) {
  return apiRequest(endpoint, {
    method: 'PATCH',
    body: JSON.stringify(data)
  });
}

/**
 * DELETE request helper
 * @param {string} endpoint - API endpoint
 * @returns {Promise} - Promise resolving to response data
 */
export function del(endpoint) {
  return apiRequest(endpoint, { method: 'DELETE' });
}

export async function imageUploadRequest(endpoint, options = {}) {
  const url = `${BASE_URL}/${endpoint.replace(/^\//, '')}`;
  
  // Default headers
  const headers = {};

  // Add auth token if available
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Build request options
  const requestOptions = {
    ...options,
    headers
  };

  try {
    const response = await fetch(url, requestOptions);
    
    // For 204 No Content responses
    if (response.status === 204) {
      return { success: true };
    }
    
    const data = await response.json();
    
    // Handle non-2xx status responses
    if (!response.ok) {
      throw new Error(data.message || `API error: ${response.status}`);
    }
    
    return data; 

  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
}
