// API Configuration
// In development: uses localhost
// In production: uses Vercel Serverless Functions (/api)

export const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export const API_ENDPOINTS = {
  availability: `${API_BASE_URL}/api/calendar/availability`,
  book: `${API_BASE_URL}/api/calendar/book`,
  register: `${API_BASE_URL}/api/events/register`,
  newsletter: `${API_BASE_URL}/api/newsletter/subscribe`,
};

