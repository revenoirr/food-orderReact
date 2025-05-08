import useFetch from '../hooks/useFetch';

const API_BASE_URL = 'https://65de35f3dccfcd562f5691bb.mockapi.io/api/v1';

export const useApi = () => {
  const { get, post, put, delete: del, loading, error } = useFetch();

  const getMeals = async () => {
    const { data, status } = await get(`${API_BASE_URL}/meals`);
    if (status !== 200) throw new Error(`Failed to fetch meals: ${status}`);
    return data;
  };

  const getMealById = async (id) => {
    const { data, status } = await get(`${API_BASE_URL}/meals/${id}`);
    if (status !== 200) throw new Error(`Failed to fetch meal: ${status}`);
    return data;
  };

  const createMeal = async (mealData) => {
    const { data, status } = await post(`${API_BASE_URL}/meals`, mealData);
    if (status !== 201) throw new Error(`Failed to create meal: ${status}`);
    return data;
  };

  const updateMeal = async (id, mealData) => {
    const { data, status } = await put(`${API_BASE_URL}/meals/${id}`, mealData);
    if (status !== 200) throw new Error(`Failed to update meal: ${status}`);
    return data;
  };

  const deleteMeal = async (id) => {
    const { data, status } = await del(`${API_BASE_URL}/meals/${id}`);
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

const fetchWithoutHook = async (url, options = {}) => {
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

    return await response.json();
  } catch (error) {
    if (error.message.includes('Failed to fetch')) {
      throw new Error('Network error: Please check your connection or the API might be down');
    }
    throw error;
  }
};

export const getMeals = async () => {
  return fetchWithoutHook(`${API_BASE_URL}/meals`);
};
