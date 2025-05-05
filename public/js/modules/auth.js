/**
 * Authentication module for handling user authentication
 */

// Store the auth token in localStorage
const TOKEN_KEY = "app_auth_token";
const USER_DATA = "app_user";
const BASE_URL = "http://localhost:5000/api/v1";

export async function login(userData) {
  try {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const res = await response.json();

    if (!response.ok) throw new Error(res.message || "Login failed");

    localStorage.setItem(TOKEN_KEY, res.token);
    localStorage.setItem(USER_DATA, JSON.stringify(res.user || res.data || {}));
    return res;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}

export async function register(userData) {
  try {
    const response = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const res = await response.json();

    if (!response.ok) throw new Error(res.message || "Registration failed");

    localStorage.setItem(TOKEN_KEY, res.token);
    localStorage.setItem(USER_DATA, JSON.stringify(res.user || res.data || {}));
    return res;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
}

/**
 * Logout current user
 */
export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_DATA);
}

export async function getCurrentUser() {
  try {
    const token = getToken();
    if (!token) return null;

    const response = await fetch(`${BASE_URL}/auth/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const res = await response.json();

    if (!response.ok) throw new Error(res.message || "Failed to get user");

    localStorage.setItem(USER_DATA, JSON.stringify(res.user || res.data || {}));
    return res.user || res.data;
  } catch (error) {
    console.error("Get current user error:", error);
    // If unauthorized (401), clear token
    if (
      error.message.includes("401") ||
      error.message.includes("Unauthorized")
    ) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_DATA);
    }
    return null;
  }
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function isAuthenticated() {
  return !!getToken();
}

export function getUserData() {
  const userData = localStorage.getItem(USER_DATA);
  return userData ? JSON.parse(userData) : null;
}
