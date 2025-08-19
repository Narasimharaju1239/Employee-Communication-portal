// Utility to get auth token from localStorage
export function getAuthToken() {
  return localStorage.getItem('token');
}

// Utility to get axios config with Authorization header
export function getAuthConfig() {
  const token = getAuthToken();
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
}
