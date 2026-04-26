const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

interface RequestOptions extends RequestInit {
  auth?: boolean;
}

export const apiFetch = async (endpoint: string, options: RequestOptions = {}) => {
  const { auth = true, ...fetchOptions } = options;
  
  const headers = new Headers(fetchOptions.headers || {});
  
  if (auth) {
    const token = sessionStorage.getItem("auth_token");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  // Handle specialized content types
  if (!(fetchOptions.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Something went wrong");
  }

  return response.json();
};

export const authApi = {
  login: (data: any) => apiFetch("/auth/login", { method: "POST", body: JSON.stringify(data), auth: false }),
  signup: (data: any) => apiFetch("/auth/signup", { method: "POST", body: JSON.stringify(data), auth: false }),
  resetPasswordRequest: (email: string) => apiFetch("/auth/forgot-password", { method: "POST", body: JSON.stringify({ email }), auth: false }),
  resetPassword: (data: any) => apiFetch("/auth/reset-password", { method: "POST", body: JSON.stringify(data), auth: false }),
};

export const notesApi = {
  process: (formData: FormData) => apiFetch("/notes/process", { method: "POST", body: formData }),
  getList: () => apiFetch("/notes/"),
  getDetail: (id: string) => apiFetch(`/notes/${id}`),
  update: (id: string, data: any) => apiFetch(`/notes/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
};

export const batchesApi = {
  getList: () => apiFetch("/notes/batches"),
  getDetail: (id: string) => apiFetch(`/notes/batches/${id}`),
};
