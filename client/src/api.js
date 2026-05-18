const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

export const getToken = () => localStorage.getItem("token");

export const setSession = ({ token, user }) => {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
};

export const clearSession = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const getStoredUser = () => {
  const rawUser = localStorage.getItem("user");
  return rawUser ? JSON.parse(rawUser) : null;
};

export const apiRequest = async (path, options = {}) => {
  const token = getToken();
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers
    }
  });

  const body = await response.json();

  if (!response.ok) {
    const details = body.errors?.map((error) => error.message).join(", ");
    throw new Error(details || body.message || "Something went wrong");
  }

  return body;
};
