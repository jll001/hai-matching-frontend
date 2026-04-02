import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface User {
  id: string;
  email: string;
  role?: 'junior' | 'senior';
  profile_completed: boolean;
  created_at: string;
}

export interface JuniorProfile {
  id: string;
  user_id: string;
  industry: string;
  years_experience: number;
  problem: string;
  preferred_language: string;
  timezone: string;
}

export interface SeniorProfile {
  id: string;
  user_id: string;
  name: string;
  industry: string;
  years_experience: number;
  expertise: string;
  bio: string;
  success_rate: number;
  available_within: number;
  languages: string[];
}

export interface Match {
  id: string;
  user_id: string;
  name: string;
  industry: string;
  years_experience: number;
  match_score: number;
  match_reasons: string[];
  bio: string;
  success_rate: number;
  available_within: number;
}

export interface Message {
  id: string;
  match_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  crisis_alert: boolean;
}

// Auth API
export const authAPI = {
  sendMagicLink: (email: string) => 
    api.post<{ message: string; demo_token: string }>('/auth/magic-link', { email }),
  
  getCurrentUser: () => 
    api.get<User>('/users/me'),
};

// Profile API
export const profileAPI = {
  updateJuniorProfile: (userId: string, data: Omit<JuniorProfile, 'id' | 'user_id'>) =>
    api.post(`/users/${userId}/profile`, { ...data, role: 'junior' }),
  
  updateSeniorProfile: (userId: string, data: Omit<SeniorProfile, 'id' | 'user_id'>) =>
    api.post(`/users/${userId}/profile`, { ...data, role: 'senior' }),
};

// Matching API
export const matchingAPI = {
  getMatches: (juniorId: string) =>
    api.post<{ matches: Match[]; fallback: string | boolean }>('/api/match', { junior_id: juniorId }),
  
  createMatch: (data: { junior_id: string; senior_id: string; match_score: number; match_reasons: string[] }) =>
    api.post('/api/matches', data),
  
  updateMatchStatus: (matchId: string, status: 'accepted' | 'rejected') =>
    api.patch(`/api/matches/${matchId}`, { status }),
};

// Messages API
export const messagesAPI = {
  sendMessage: (data: { match_id: string; content: string }) =>
    api.post<Message>('/messages', data),
  
  getMessages: (matchId: string) =>
    api.get<Message[]>(`/messages/${matchId}`),
};

// Admin API
export const adminAPI = {
  getAllUsers: () =>
    api.get<User[]>('/users'),
  
  getAllMatches: () =>
    api.get<any[]>('/api/matches'),
  
  getCrisisMessages: () =>
    api.get<Message[]>('/messages/crisis'),
};

export default api;
