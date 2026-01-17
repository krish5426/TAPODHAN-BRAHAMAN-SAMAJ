//const API_BASE_URL = 'http://localhost:3000';
const API_BASE_URL = 'http://tbsapi.trajinfotech.com';

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
  PROFILE: `${API_BASE_URL}/profile`
};

export default API_BASE_URL;