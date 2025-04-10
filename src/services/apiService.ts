import axios from 'axios';
import type { AxiosInstance, AxiosResponse, AxiosProgressEvent } from 'axios';
import type { ApiResponse } from '@/types';

export class ApiService {
  protected api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (axios.isAxiosError(error)) {
          const message = error.response?.data?.message || 'API request failed';
          return Promise.reject(new Error(message));
        }
        return Promise.reject(new Error('An unexpected error occurred'));
      },
    );
  }

  protected async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    const response: AxiosResponse<T> = await this.api.get(endpoint);
    return {
      data: response.data,
      status: response.status,
    };
  }

  protected async post<T>(endpoint: string, data: unknown): Promise<ApiResponse<T>> {
    const response: AxiosResponse<T> = await this.api.post(endpoint, data);
    return {
      data: response.data,
      status: response.status,
    };
  }

  protected async postForm<T>(
    endpoint: string,
    formData: FormData,
    config: {
      onUploadProgress?: (progressEvent: AxiosProgressEvent) => void;
    } = {},
  ): Promise<ApiResponse<T>> {
    const response: AxiosResponse<T> = await this.api.post(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: config.onUploadProgress,
    });
    return {
      data: response.data,
      status: response.status,
    };
  }

  protected async put<T>(endpoint: string, data: unknown): Promise<ApiResponse<T>> {
    const response: AxiosResponse<T> = await this.api.put(endpoint, data);
    return {
      data: response.data,
      status: response.status,
    };
  }

  protected async putForm<T>(
    endpoint: string,
    formData: FormData,
    config: {
      onUploadProgress?: (progressEvent: AxiosProgressEvent) => void;
    } = {},
  ): Promise<ApiResponse<T>> {
    const response: AxiosResponse<T> = await this.api.put(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: config.onUploadProgress,
    });
    return {
      data: response.data,
      status: response.status,
    };
  }

  protected async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    const response: AxiosResponse<T> = await this.api.delete(endpoint);
    return {
      data: response.data,
      status: response.status,
    };
  }
}
