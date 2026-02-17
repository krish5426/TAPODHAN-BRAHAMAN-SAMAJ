const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.tapodhanbrahmansamaj.com';

export const API_ENDPOINTS = {
  EVENTS: `${API_BASE_URL}/events`,
  UPLOADS: `${API_BASE_URL}/uploads`,
  BUSINESSES: `${API_BASE_URL}/businesses`,
  LOGIN: `${API_BASE_URL}/login`,
  ADMIN_LOGIN: `${API_BASE_URL}/admin/login`,
  BUSINESS: `${API_BASE_URL}/business`,
  MY_BUSINESS: `${API_BASE_URL}/my-business`,
  ADMIN_BUSINESS: `${API_BASE_URL}/api/admin/business`,
  REGISTER: `${API_BASE_URL}/register`,
  CONTACT: `${API_BASE_URL}/contact`,
  PROFILE: `${API_BASE_URL}/profile`,
  PROFILES: `${API_BASE_URL}/profiles`,
  ADMIN_PROFILES: `${API_BASE_URL}/api/admin/profiles`,
  MY_MATRIMONY_PROFILES: `${API_BASE_URL}/my-matrimony-profiles`
};

export default API_BASE_URL;