// API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Generic fetch wrapper with error handling
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Add auth token if available
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers = {
      ...config.headers,
      'Authorization': `Bearer ${token}`,
    };
  }

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Network error' }));
      throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// Authentication API
export const authAPI = {
  login: async (email: string, password: string) => {
    return apiRequest<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  signup: async (email: string, password: string) => {
    return apiRequest<{ token: string; user: any }>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  logout: async () => {
    return apiRequest('/auth/logout', {
      method: 'POST',
    });
  },

  getProfile: async () => {
    return apiRequest<{ user: any }>('/auth/profile');
  },
};

// Habits API
export const habitsAPI = {
  getAll: async () => {
    return apiRequest<{ habits: any[] }>('/habits');
  },

  create: async (habitData: {
    name: string;
    frequency: string;
    category: string;
    start_date: string;
  }) => {
    return apiRequest<{ habit: any }>('/habits', {
      method: 'POST',
      body: JSON.stringify(habitData),
    });
  },

  update: async (habitId: string, habitData: Partial<{
    name: string;
    frequency: string;
    category: string;
    start_date: string;
  }>) => {
    return apiRequest<{ habit: any }>(`/habits/${habitId}`, {
      method: 'PUT',
      body: JSON.stringify(habitData),
    });
  },

  delete: async (habitId: string) => {
    return apiRequest(`/habits/${habitId}`, {
      method: 'DELETE',
    });
  },

  // Check-ins API
  getCheckins: async (habitId?: string) => {
    const endpoint = habitId ? `/habits/${habitId}/checkins` : '/habits/checkins';
    return apiRequest<{ checkins: any[] }>(endpoint);
  },

  addCheckin: async (habitId: string, checkinData: { checkin_date: string; notes?: string }) => {
    return apiRequest<{ checkin: any }>(`/habits/${habitId}/checkins`, {
      method: 'POST',
      body: JSON.stringify(checkinData),
    });
  },

  removeCheckin: async (habitId: string, checkinId: string) => {
    return apiRequest(`/habits/${habitId}/checkins/${checkinId}`, {
      method: 'DELETE',
    });
  },
};

// Analytics API
export const analyticsAPI = {
  getStats: async () => {
    return apiRequest<{
      total_habits: number;
      total_checkins: number;
      average_streak: number;
      completion_rate: number;
      weekly_data: any[];
      category_distribution: any[];
    }>('/analytics/stats');
  },

  getHabitProgress: async (habitId: string) => {
    return apiRequest<{ progress: any[] }>(`/analytics/habits/${habitId}/progress`);
  },
};

export default {
  auth: authAPI,
  habits: habitsAPI,
  analytics: analyticsAPI,
};
