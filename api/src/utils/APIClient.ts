import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export class APIClient {
  private client: AxiosInstance;
  private baseURL: string;

  constructor(baseURL?: string) {
    this.baseURL = baseURL || process.env.BASE_URL || 'https://freelance-learn-automation.vercel.app';
    
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Accept': process.env.HEADER_ACCEPT || 'application/json',
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });
  }

  /**
   * GET request
   */
  async get<T = any>(endpoint: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    try {
      const response = await this.client.get<T>(endpoint, config);
      return response;
    } catch (error) {
      console.error(`GET ${endpoint} failed:`, error);
      throw error;
    }
  }

  /**
   * POST request
   */
  async post<T = any>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    try {
      const response = await this.client.post<T>(endpoint, data, config);
      return response;
    } catch (error) {
      console.error(`POST ${endpoint} failed:`, error);
      throw error;
    }
  }

  /**
   * PUT request
   */
  async put<T = any>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    try {
      const response = await this.client.put<T>(endpoint, data, config);
      return response;
    } catch (error) {
      console.error(`PUT ${endpoint} failed:`, error);
      throw error;
    }
  }

  /**
   * DELETE request
   */
  async delete<T = any>(endpoint: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    try {
      const response = await this.client.delete<T>(endpoint, config);
      return response;
    } catch (error) {
      console.error(`DELETE ${endpoint} failed:`, error);
      throw error;
    }
  }

  /**
   * Set custom headers
   */
  setHeaders(headers: Record<string, string>): void {
    this.client.defaults.headers.common = {
      ...this.client.defaults.headers.common,
      ...headers,
    };
  }

  /**
   * Get base URL
   */
  getBaseURL(): string {
    return this.baseURL;
  }
}

export default new APIClient();
