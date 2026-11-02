import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for Auth JWT Token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('water_auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

export const authService = {
  login: async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    return res.data;
  },
  register: async (email, full_name, password) => {
    const res = await api.post('/auth/register', { email, full_name, password });
    return res.data;
  },
  getMe: async () => {
    const res = await api.get('/auth/me');
    return res.data;
  }
};

export const waterService = {
  analyzeSample: async (data) => {
    const res = await api.post('/water/analyze', data);
    return res.data;
  },
  uploadCsv: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await api.post('/water/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },
  getHistory: async (params = {}) => {
    const res = await api.get('/water/history', { params });
    return res.data;
  },
  getSampleDetail: async (id) => {
    const res = await api.get(`/water/${id}`);
    return res.data;
  }
};

export const dashboardService = {
  getSummary: async () => {
    const res = await api.get('/dashboard/summary');
    return res.data;
  }
};

export const locationsService = {
  getLocations: async () => {
    const res = await api.get('/locations');
    return res.data;
  },
  createLocation: async (data) => {
    const res = await api.post('/locations', data);
    return res.data;
  },
  deleteLocation: async (id) => {
    await api.delete(`/locations/${id}`);
  }
};

export const alertsService = {
  getAlerts: async (params = {}) => {
    const res = await api.get('/alerts', { params });
    return res.data;
  },
  resolveAlert: async (id) => {
    const res = await api.put(`/alerts/${id}/resolve`);
    return res.data;
  },
  deleteAlert: async (id) => {
    await api.delete(`/alerts/${id}`);
  }
};

export const modelService = {
  getModelInfo: async () => {
    const res = await api.get('/model/info');
    return res.data;
  }
};

export default api;
