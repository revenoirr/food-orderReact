const API_BASE_URL = 'https://65de35f3dccfcd562f5691bb.mockapi.io/api/v1';

export const getMeals = async () => {
  try {
    console.log(`Fetching from: ${API_BASE_URL}/meals`);
    
    const response = await fetch(`${API_BASE_URL}/meals`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }, 
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API error (${response.status}): ${errorText}`);
      throw new Error(`Failed to fetch meals: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching meals:', error);
    if (error.message.includes('Failed to fetch')) {
      throw new Error('Network error: Please check your connection or the API might be down');
    }
    throw error;
  }
};