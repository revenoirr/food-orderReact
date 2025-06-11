// fetchSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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

interface FetchState {
  loading: boolean;
  error: string | null;
  data: any | null;
  apiLogs: ApiLog[];
}

const initialState: FetchState = {
  loading: false,
  error: null,
  data: null,
  apiLogs: [],
};

const fetchSlice = createSlice({
  name: 'fetch',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    
    setData: (state, action: PayloadAction<any>) => {
      state.data = action.payload;
    },
    
    addApiLog: (state, action: PayloadAction<Omit<ApiLog, 'timestamp' | 'timeLogged'>>) => {
      const { url, method, payload, status } = action.payload;
      const newLog: ApiLog = {
        timestamp: new Date().toISOString(),
        url,
        method,
        payload: payload || null,
        status,
        timeLogged: new Date().toLocaleString()
      };
      
      // Keep only the last 100 logs
      state.apiLogs = [...state.apiLogs, newLog].slice(-100);
    },
    
    clearApiLogs: (state) => {
      state.apiLogs = [];
    },
    
    resetFetchState: (state) => {
      state.loading = false;
      state.error = null;
      state.data = null;
    },
  },
});

export const { 
  setLoading, 
  setError, 
  setData, 
  addApiLog, 
  clearApiLogs, 
  resetFetchState 
} = fetchSlice.actions;

export default fetchSlice.reducer;

export type { FetchOptions, ApiLog, FetchState };