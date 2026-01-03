export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
export const API_ENDPOINTS = {
  CHAT: `${API_BASE_URL}/api/chat`,
} as const;
