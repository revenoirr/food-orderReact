import useFetch from '../hooks/useFetch';

export interface Meal {
  id?: string | number;
  meal: string;
  price: number;
  category?: string;
  img?: string;
  instructions?: string;
  [key: string]: any;
}

const API_BASE_URL = 'https://65de35f3dccfcd562f5691bb.mockapi.io/api/v1';

export const useApi = () => {
  const { get, post, put, delete: del, loading, error } = useFetch();

  const getMeals = async (): Promise<Meal[]> => {
    const { data, status } = await get<Meal[]>(`${API_BASE_URL}/meals`);
    if (status !== 200) throw new Error(`Failed to fetch meals: ${status}`);
    return data;
  };

  const getMealById = async (id: string | number): Promise<Meal> => {
    const { data, status } = await get<Meal>(`${API_BASE_URL}/meals/${id}`);
    if (status !== 200) throw new Error(`Failed to fetch meal: ${status}`);
    return data;
  };

  const createMeal = async (mealData: Omit<Meal, 'id'>): Promise<Meal> => {
    const { data, status } = await post<Meal>(`${API_BASE_URL}/meals`, mealData);
    if (status !== 201) throw new Error(`Failed to create meal: ${status}`);
    return data;
  };

  const updateMeal = async (id: string | number, mealData: Partial<Meal>): Promise<Meal> => {
    const { data, status } = await put<Meal>(`${API_BASE_URL}/meals/${id}`, mealData);
    if (status !== 200) throw new Error(`Failed to update meal: ${status}`);
    return data;
  };

  const deleteMeal = async (id: string | number): Promise<Meal> => {
    const { data, status } = await del<Meal>(`${API_BASE_URL}/meals/${id}`);
    if (status !== 200) throw new Error(`Failed to delete meal: ${status}`);
    return data;
  };

  return {
    getMeals,
    getMealById,
    createMeal,
    updateMeal,
    deleteMeal,
    loading,
    error,
  };
};

interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
}

const fetchWithoutHook = async <T = any>(url: string, options: FetchOptions = {}): Promise<T> => {
  try {
    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      ...options,
    });

    if (!response.ok) {
      await response.text(); 
      throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
    }

    return await response.json() as T;
  } catch (error) {
    if (error instanceof Error && error.message.includes('Failed to fetch')) {
      throw new Error('Network error: Please check your connection or the API might be down');
    }
    throw error;
  }
};

export const getMeals = async (): Promise<Meal[]> => {
  return fetchWithoutHook<Meal[]>(`${API_BASE_URL}/meals`);
};