import { useState } from 'react';

interface FetchOptions {
  method?: string;
  payload?: any;
  headers?: Record<string, string>;
  [key: string]: any;
}

interface ApiLog {
  timestamp: string;
  url: string;
  method: string;
  payload: any | null;
  status: number;
  timeLogged: string;
}

interface FetchResponse<T> {
  data: T;
  status: number;
}

const useFetch = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any | null>(null);

  const logApiCall = (url: string, payload: any | null, status: number, method: string): void => {
    try {
      const existingLogs: ApiLog[] = JSON.parse(localStorage.getItem('apiLogs') || '[]');
      const newLog: ApiLog = {
        timestamp: new Date().toISOString(),
        url,
        method,
        payload: payload || null,
        status,
        timeLogged: new Date().toLocaleString()
      };
      const updatedLogs: ApiLog[] = [...existingLogs, newLog];
      localStorage.setItem('apiLogs', JSON.stringify(updatedLogs.slice(-100)));
      console.log('API Call Logged:', newLog);
    } catch (err) {
      console.error('Error logging API call to local storage:', err instanceof Error ? err.message : String(err));
    }
  };

  const request = async <T = any>(url: string, options: FetchOptions = {}): Promise<FetchResponse<T>> => {
    const { method = 'GET', payload = null, ...restOptions } = options;
    
    setLoading(true);
    setError(null);
    
    try {
      const fetchOptions: RequestInit = {
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
      const responseData: T = await response.json();
      
      logApiCall(url, payload, response.status, method);
      setLoading(false);
      setData(responseData);
      
      return { data: responseData, status: response.status };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
      setLoading(false);
      logApiCall(url, payload, 0, method);
      throw err;
    }
  };

  const get = <T = any>(url: string, options: Omit<FetchOptions, 'method' | 'payload'> = {}): Promise<FetchResponse<T>> => 
    request<T>(url, { ...options, method: 'GET' });
  
  const post = <T = any>(url: string, payload: any, options: Omit<FetchOptions, 'method' | 'payload'> = {}): Promise<FetchResponse<T>> => 
    request<T>(url, { ...options, method: 'POST', payload });
  
  const put = <T = any>(url: string, payload: any, options: Omit<FetchOptions, 'method' | 'payload'> = {}): Promise<FetchResponse<T>> => 
    request<T>(url, { ...options, method: 'PUT', payload });
  
  const del = <T = any>(url: string, options: Omit<FetchOptions, 'method'> = {}): Promise<FetchResponse<T>> => 
    request<T>(url, { ...options, method: 'DELETE' });

  const getApiLogs = (): ApiLog[] => {
    try {
      return JSON.parse(localStorage.getItem('apiLogs') || '[]');
    } catch (err) {
      console.error('Error retrieving API logs from local storage:', err instanceof Error ? err.message : String(err));
      return [];
    }
  };

  const clearApiLogs = (): void => {
    try {
      localStorage.removeItem('apiLogs');
      console.log('API logs cleared from local storage');
    } catch (err) {
      console.error('Error clearing API logs from local storage:', err instanceof Error ? err.message : String(err));
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