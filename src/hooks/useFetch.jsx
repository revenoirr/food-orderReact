import { useState, useCallback } from 'react';

const useFetch = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const logApiCall = useCallback((url, payload, status, method) => {
    try {
      const existingLogs = JSON.parse(localStorage.getItem('apiLogs')) || [];
      const newLog = {
        timestamp: new Date().toISOString(),
        url,
        method,
        payload: payload || null,
        status,
        timeLogged: new Date().toLocaleString()
      };
      const updatedLogs = [...existingLogs, newLog];
      localStorage.setItem('apiLogs', JSON.stringify(updatedLogs.slice(-100)));
      console.log('API Call Logged:', newLog);
    } catch (err) {
      console.error('Error logging API call to local storage:', err);
    }
  }, []);

  const get = useCallback(async (url, options = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      });
      const data = await response.json();
      logApiCall(url, null, response.status, 'GET');
      setLoading(false);
      return { data, status: response.status };
    } catch (err) {
      setError(err.message);
      setLoading(false);
      logApiCall(url, null, 0, 'GET');
      throw err;
    }
  }, [logApiCall]);

  const post = useCallback(async (url, payload, options = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        body: JSON.stringify(payload),
        ...options
      });
      const data = await response.json();
      logApiCall(url, payload, response.status, 'POST');
      setLoading(false);
      return { data, status: response.status };
    } catch (err) {
      setError(err.message);
      setLoading(false);
      logApiCall(url, payload, 0, 'POST');
      throw err;
    }
  }, [logApiCall]);

  const put = useCallback(async (url, payload, options = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        body: JSON.stringify(payload),
        ...options
      });
      const data = await response.json();
      logApiCall(url, payload, response.status, 'PUT');
      setLoading(false);
      return { data, status: response.status };
    } catch (err) {
      setError(err.message);
      setLoading(false);
      logApiCall(url, payload, 0, 'PUT');
      throw err;
    }
  }, [logApiCall]);

  const del = useCallback(async (url, options = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      });
      const data = await response.json();
      logApiCall(url, null, response.status, 'DELETE');
      setLoading(false);
      return { data, status: response.status };
    } catch (err) {
      setError(err.message);
      setLoading(false);
      logApiCall(url, null, 0, 'DELETE');
      throw err;
    }
  }, [logApiCall]);

  const getApiLogs = useCallback(() => {
    try {
      return JSON.parse(localStorage.getItem('apiLogs')) || [];
    } catch (err) {
      console.error('Error retrieving API logs from local storage:', err);
      return [];
    }
  }, []);

  const clearApiLogs = useCallback(() => {
    try {
      localStorage.removeItem('apiLogs');
      console.log('API logs cleared from local storage');
    } catch (err) {
      console.error('Error clearing API logs from local storage:', err);
    }
  }, []);

  return {
    get,
    post,
    put,
    delete: del,
    loading,
    error,
    getApiLogs,
    clearApiLogs
  };
};

export default useFetch;
