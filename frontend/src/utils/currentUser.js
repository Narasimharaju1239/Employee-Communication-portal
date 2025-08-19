// Utility to decode JWT and get user info
import { jwtDecode } from "jwt-decode";
import { getAuthToken } from "./auth";

export function getCurrentUser() {
  const token = getAuthToken();
  if (!token) return null;
  try {
    return jwtDecode(token);
  } catch {
    return null;
  }
}
