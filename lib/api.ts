import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Token storage helpers
let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
  if (token) {
    localStorage.setItem("authToken", token);
  } else {
    localStorage.removeItem("authToken");
  }
};

export const getAccessToken = () => {
  if (!accessToken && typeof window !== "undefined") {
    accessToken = localStorage.getItem("authToken");
  }
  return accessToken;
};

export const setRefreshToken = (token: string | null) => {
  if (typeof window !== "undefined") {
    if (token) {
      localStorage.setItem("refreshToken", token);
    } else {
      localStorage.removeItem("refreshToken");
    }
  }
};

export const getRefreshToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("refreshToken");
  }
  return null;
};

export const clearTokens = () => {
  accessToken = null;
  if (typeof window !== "undefined") {
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
  }
};

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor with refresh token logic
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // If 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue the request while refreshing
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = getRefreshToken();

      if (!refreshToken) {
        clearTokens();
        if (typeof window !== "undefined") {
          window.location.href = "/sign-in";
        }
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(
          `${api.defaults.baseURL}/refresh`,
          { refreshToken }
        );

        const newAccessToken = response.data.accessToken;
        setAccessToken(newAccessToken);
        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as Error, null);
        clearTokens();
        if (typeof window !== "undefined") {
          window.location.href = "/sign-in";
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// Types for API requests/responses
export interface SignUpData {
  username: string;
  password: string;
}

export interface SignInData {
  username: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  accessToken?: string;
  refreshToken?: string;
  user?: {
    id: number;
    username: string;
  };
}

export interface ApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
}

// Invoice types matching backend
export interface InvoiceItem {
  item: string;
  qty: number;
  price: number;
}

export interface Invoice {
  id: number;
  invoiceNumber: string;
  customer: string;
  amount: number;
  date: string;
  dueDate: string;
  status: "Paid" | "Unpaid" | "Overdue";
  description: string;
  items: InvoiceItem[];
}

export interface InvoicesResponse {
  message: string;
  user: { id: number; username: string };
  invoices: Invoice[];
}

export interface CreateInvoiceData {
  customer: string;
  date: string;
  dueDate: string;
  description?: string;
  items: InvoiceItem[];
}

// Auth API functions
export const authApi = {
  // Sign up user
  signUp: async (data: SignUpData): Promise<AuthResponse> => {
    const response = await api.post("/register", {
      username: data.username,
      password: data.password,
    });

    return {
      success: true,
      message: response.data.message,
      user: response.data.user,
    };
  },

  // Sign in user
  signIn: async (data: SignInData): Promise<AuthResponse> => {
    const response = await api.post("/login", {
      username: data.username,
      password: data.password,
    });

    // Store tokens
    if (response.data.accessToken) {
      setAccessToken(response.data.accessToken);
    }
    if (response.data.refreshToken) {
      setRefreshToken(response.data.refreshToken);
    }

    return {
      success: true,
      message: response.data.message,
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken,
    };
  },

  // Get current user profile from stored token
  getProfile: async (): Promise<AuthResponse> => {
    const token = getAccessToken();
    if (!token) throw new Error("No authentication token found");

    // Decode username from JWT payload (base64)
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return {
        success: true,
        message: "Profile loaded",
        user: {
          id: payload.id,
          username: payload.username,
        },
      };
    } catch {
      return {
        success: true,
        message: "Profile loaded",
        user: { id: 1, username: "User" },
      };
    }
  },

  // Logout user
  logout: async (): Promise<{ success: boolean }> => {
    clearTokens();
    return { success: true };
  },
};

// Invoice API functions
export const invoiceApi = {
  // Get all invoices
  getAll: async (): Promise<InvoicesResponse> => {
    const response = await api.get("/invoices");
    return response.data;
  },

  // Create new invoice
  create: async (data: CreateInvoiceData): Promise<{ message: string; invoice: Invoice }> => {
    const response = await api.post("/invoices", data);
    return response.data;
  },
};

// Generic API function for other endpoints
export const apiClient = api;
export default api;