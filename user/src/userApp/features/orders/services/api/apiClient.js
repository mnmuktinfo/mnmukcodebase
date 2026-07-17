const isDev = typeof import.meta !== 'undefined' ? import.meta.env?.DEV : process.env.NODE_ENV !== 'production';

const API_BASE_URL = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL)
  ? import.meta.env.VITE_API_URL
  : 'http://localhost:5000/api/v1';

const REQUEST_TIMEOUT_MS = 15000;

// Same request/error-handling logic as OrderService's internal apiFetch,
// pulled out so any service (orders, payments, customer contact, etc.)
// gets identical timeout handling, JSON parsing, and Mongoose/Joi error
// extraction instead of re-implementing it per file.
export const apiFetch = async (endpoint, options = {}) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (options.token) {
      headers['Authorization'] = `Bearer ${options.token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      signal: controller.signal,
    });

    if (response.status === 204) {
      if (!response.ok) {
        const err = new Error(`API Error: ${response.status}`);
        err.status = response.status;
        throw err;
      }
      return null;
    }

    const contentType = response.headers.get('content-type') || '';
    let data;

    if (contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      if (!response.ok) {
        const err = new Error(`API Error: ${response.status}`);
        err.status = response.status;
        throw err;
      }
      if (isDev) console.warn(`⚠️ [apiClient] Non-JSON 2xx response from ${endpoint}:`, text.slice(0, 200));
      data = null;
    }

    if (!response.ok) {
      let errorMsg = data?.message || data?.error || `API Error: ${response.status}`;

      if (data?.errors && typeof data.errors === 'object') {
        const detailedErrors = Object.values(data.errors)
          .map(e => e.message || e)
          .join(' | ');
        if (detailedErrors) errorMsg = `Validation: ${detailedErrors}`;
      } else if (Array.isArray(data?.details)) {
        const detailedErrors = data.details.map(d => d.message).join(' | ');
        if (detailedErrors) errorMsg = `Validation: ${detailedErrors}`;
      }

      const err = new Error(errorMsg);
      err.status = response.status;
      err.rawData = data;
      throw err;
    }

    return data;
  } catch (error) {
    if (error.name === 'AbortError') {
      const timeoutErr = new Error('Request timed out. Please check your connection and try again.');
      timeoutErr.status = null;
      if (isDev) console.error(`🚨 [apiClient] Timeout at ${endpoint}`);
      throw timeoutErr;
    }
    if (isDev) console.error(`🚨 [apiClient] API Error at ${endpoint}:`, error);
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
};

export const unwrap = (response) => response?.data ?? response;