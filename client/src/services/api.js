const API_BASE_URL = '/api';

const getHeaders = () => {
  const token = localStorage.getItem('loop_kitchen_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export const api = {
  // Auth
  register: async (userData) => {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(userData),
    });
    return res.json();
  },

  login: async (credentials) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(credentials),
    });
    return res.json();
  },

  getMe: async () => {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  updatePreferences: async (preferences) => {
    const res = await fetch(`${API_BASE_URL}/auth/preferences`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ preferences }),
    });
    return res.json();
  },

  // Pantry
  getPantry: async () => {
    const res = await fetch(`${API_BASE_URL}/pantry`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  addPantryItem: async (itemData) => {
    const res = await fetch(`${API_BASE_URL}/pantry`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(itemData),
    });
    return res.json();
  },

  deletePantryItem: async (itemId) => {
    const res = await fetch(`${API_BASE_URL}/pantry/${itemId}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return res.json();
  },

  useIngredients: async (ingredients) => {
    const res = await fetch(`${API_BASE_URL}/pantry/use-ingredients`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ ingredients }),
    });
    return res.json();
  },

  // Grocery
  getGroceryList: async () => {
    const res = await fetch(`${API_BASE_URL}/grocery`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  saveGroceryList: async (listData) => {
    const res = await fetch(`${API_BASE_URL}/grocery`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(listData),
    });
    return res.json();
  },

  toggleBoughtItem: async (itemId) => {
    const res = await fetch(`${API_BASE_URL}/grocery/toggle/${itemId}`, {
      method: 'PATCH',
      headers: getHeaders(),
    });
    return res.json();
  },

  // AI Endpoints
  getSmartRecipes: async (preferences) => {
    const res = await fetch(`${API_BASE_URL}/ai/recipes`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ preferences }),
    });
    return res.json();
  },

  optimizeCart: async (preferences) => {
    const res = await fetch(`${API_BASE_URL}/ai/optimize-cart`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ preferences }),
    });
    return res.json();
  },

  generateWeeklyPlan: async (preferences) => {
    const res = await fetch(`${API_BASE_URL}/ai/weekly-planner`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ preferences }),
    });
    return res.json();
  },

  generateGroceryFromPlan: async () => {
    const res = await fetch(`${API_BASE_URL}/ai/generate-grocery-from-plan`, {
      method: 'POST',
      headers: getHeaders(),
    });
    return res.json();
  },

  getAiHistory: async () => {
    const res = await fetch(`${API_BASE_URL}/ai/history`, {
      headers: getHeaders(),
    });
    return res.json();
  }
};
