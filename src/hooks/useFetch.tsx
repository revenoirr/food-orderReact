// useFetch.ts
import { useDispatch, useSelector } from 'react-redux';
import { setLoading, setError, setData, addApiLog, clearApiLogs, resetFetchState } from '../slices/fetchslice';
import type { FetchOptions, ApiLog } from '../slices/fetchslice';

// You'll need to replace this with your actual RootState type
interface RootState {
  fetch: {
    loading: boolean;
    error: string | null;
    data: any | null;
    apiLogs: ApiLog[];
  };
  // ... other slices
}

interface FetchResponse<T> {
  data: T;
  status: number;
}

const useFetch = () => {
  const dispatch = useDispatch();
  const { loading, error, data, apiLogs } = useSelector((state: RootState) => state.fetch);

  const request = async <T = any>(url: string, options: FetchOptions = {}): Promise<FetchResponse<T>> => {
    const { method = 'GET', payload = null, ...restOptions } = options;
    
    dispatch(setLoading(true));
    dispatch(setError(null));
    
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
      
      // Log the API call
      dispatch(addApiLog({
        url,
        method,
        payload,
        status: response.status
      }));
      
      dispatch(setLoading(false));
      dispatch(setData(responseData));
      
      return { data: responseData, status: response.status };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      dispatch(setError(errorMessage));
      dispatch(setLoading(false));
      
      // Log failed API call
      dispatch(addApiLog({
        url,
        method,
        payload,
        status: 0
      }));
      
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
    return apiLogs;
  };

  const clearLogs = (): void => {
    dispatch(clearApiLogs());
  };

  const resetState = (): void => {
    dispatch(resetFetchState());
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
    clearApiLogs: clearLogs,
    resetFetchState: resetState,
    // Additional Redux-specific methods
    apiLogs
  };
};

export default useFetch;