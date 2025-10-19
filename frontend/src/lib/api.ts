// API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Generic fetch wrapper with error handling
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const config: RequestInit = {
    headers: {
      ...options.headers,
    },
    ...options,
  };

  const token = localStorage.getItem('authToken');
  if (token) {
    if (!config.headers) {
      config.headers = {};
    }
    (config.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'An unknown error occurred' }));
      throw new Error(errorData.detail || `HTTP ${response.status}`);
    }

    if (response.status === 204 || response.headers.get('content-length') === '0') {
      return {} as T;
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// --- Authentication API ---
export const authAPI = {
  login: async (email: string, password: string) => {
    const params = new URLSearchParams();
    params.append('username', email);
    params.append('password', password);

    return apiRequest<{ access_token: string }>('/auth/login', {
      method: 'POST',
      body: params,
    });
  },

  signup: async (username: string, email: string, password: string) => {
    return apiRequest<any>('/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });
  },

  getProfile: async () => {
    return apiRequest<any>('/auth/me');
  },
};

// --- Habits API ---
export const habitsAPI = {
  // FIX: Added back the crucial getAll endpoint
  getAll: async () => {
    return apiRequest<any[]>('/habits/');
  },

  create: async (habitData: {
    name: string;
    description?: string; // FIX: Added optional description field
    frequency: string;
    category: string;
    start_date: string;
  }) => {
    return apiRequest<any>('/habits/', { // Returns the Habit object directly
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(habitData),
    });
  },

  delete: async (habitId: number) => {
    return apiRequest(`/habits/${habitId}`, {
      method: 'DELETE',
    });
  },
};

// --- Check-ins API ---
export const checkinsAPI = {
  getAllForUser: async () => {
    return apiRequest<any[]>('/habits/checkins/all');
  },
  
  addCheckin: async (habitId: number, checkinData: { checkin_date: string }) => {
    return apiRequest<any>(`/habits/${habitId}/checkins/`, { // Returns the Checkin object directly
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(checkinData),
    });
  },

  removeCheckin: async (habitId: number, checkinId: number) => {
    return apiRequest(`/habits/${habitId}/checkins/${checkinId}`, {
      method: 'DELETE',
    });
  },
};

// --- Analytics API ---
export const analyticsAPI = {
  getStats: async () => {
    return apiRequest<any>('/analytics/stats');
  },
};

// --- AI API ---
export const aiAPI = {
  suggestHabits: async () => {
    return apiRequest<any[]>('/ai/suggest_habits');
  },
};

// --- Report API ---
export const reportAPI = {
  exportPdf: async () => {
    // Note: We use the browser's native fetch and Blob to handle file download directly, 
    // bypassing our generic apiRequest function which expects JSON.
    const url = `${API_BASE_URL}/report/pdf`;
    const token = localStorage.getItem('authToken');

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to generate PDF report.');
    }

    const blob = await response.blob();
    const contentDisposition = response.headers.get('Content-Disposition') || 'filename=report.pdf';
    const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
    const filename = filenameMatch ? filenameMatch[1] : 'report.pdf';

    // Trigger file download
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(downloadUrl);
  }
};

const api = {
  auth: authAPI,
  habits: habitsAPI,
  checkins: checkinsAPI, // FIX: Ensure checkinsAPI is included
  analytics: analyticsAPI,
  ai: aiAPI,
  report: reportAPI,
};

export default api;