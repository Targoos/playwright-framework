import { APIRequestContext, APIResponse } from '@playwright/test';

export class ApiClient {
  private readonly request: APIRequestContext;
  private readonly baseURL: string;

  constructor(request: APIRequestContext, baseURL: string) {
    this.request = request;
    this.baseURL = baseURL.replace(/\/$/, '');
  }

  async get(path: string, options?: { headers?: Record<string, string> }): Promise<APIResponse> {
    return this.request.get(`${this.baseURL}${path}`, {
      headers: options?.headers,
    });
  }

  async post<T>(path: string, body: T, options?: { headers?: Record<string, string> }): Promise<APIResponse> {
    return this.request.post(`${this.baseURL}${path}`, {
      data: body,
      headers: options?.headers,
    });
  }

  async put<T>(path: string, body: T, options?: { headers?: Record<string, string> }): Promise<APIResponse> {
    return this.request.put(`${this.baseURL}${path}`, {
      data: body,
      headers: options?.headers,
    });
  }

  async delete(path: string, options?: { headers?: Record<string, string> }): Promise<APIResponse> {
    return this.request.delete(`${this.baseURL}${path}`, {
      headers: options?.headers,
    });
  }
}
