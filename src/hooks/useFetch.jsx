import { useState } from 'react';

const useFetch = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const logApiCall = (url, payload, status, method) => {
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
  };

  const request = async (url, options = {}) => {
    const { method = 'GET', payload = null, ...restOptions } = options;
    
    setLoading(true);
    setError(null);
    
    try {
      const fetchOptions = {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...restOptions.headers
        },
        ...restOptions
      };
      
      if (['POST', 'PUT', 'PATCH'].includes(method) && payload) {
        fetchOptions.body = JSON.stringify(payload);
      }
      
      const response = await fetch(url, fetchOptions);
      const responseData = await response.json();
      
      logApiCall(url, payload, response.status, method);
      setLoading(false);
      setData(responseData);
      
      return { data: responseData, status: response.status };
    } catch (err) {
      setError(err.message);
      setLoading(false);
      logApiCall(url, payload, 0, method);
      throw err;
    }
  };

  const get = (url, options = {}) => request(url, { ...options, method: 'GET' });
  const post = (url, payload, options = {}) => request(url, { ...options, method: 'POST', payload });
  const put = (url, payload, options = {}) => request(url, { ...options, method: 'PUT', payload });
  const del = (url, options = {}) => request(url, { ...options, method: 'DELETE' });

  const getApiLogs = () => {
    try {
      return JSON.parse(localStorage.getItem('apiLogs')) || [];
    } catch (err) {
      console.error('Error retrieving API logs from local storage:', err);
      return [];
    }
  };

  const clearApiLogs = () => {
    try {
      localStorage.removeItem('apiLogs');
      console.log('API logs cleared from local storage');
    } catch (err) {
      console.error('Error clearing API logs from local storage:', err);
    }
  };

  return {
    get,
    post,
    put,
    delete: del,
    loading,
    error,
    data,
    getApiLogs,
    clearApiLogs
  };
};

export default useFetch;