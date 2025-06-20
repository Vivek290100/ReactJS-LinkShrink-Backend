import type { ShortenedUrl } from "../types";

class ApiService {
private baseUrl = import.meta.env.VITE_API_BASE_URL;
  private getHeaders() {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    return headers;
  }

  async signup(username: string, email: string, password: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/auth/signup`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ username, email, password }),
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Signup failed');
    }
  }

  async login(email: string, password: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/auth/login`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ email, password }),
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }
  }

  async createShortUrl(originalUrl: string): Promise<ShortenedUrl> {
    const response = await fetch(`${this.baseUrl}/url`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ originalUrl }),
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create short URL');
    }

    return response.json();
  }

  async getUserUrls(): Promise<ShortenedUrl[]> {
    const response = await fetch(`${this.baseUrl}/url`, {
      method: 'GET',
      headers: this.getHeaders(),
      credentials: 'include',
    });

    

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch URLs');
    }

    return response.json();
  }

  async logout(): Promise<void> {
    const response = await fetch(`${this.baseUrl}/auth/logout`, {
      method: 'POST',
      headers: this.getHeaders(),
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Logout failed');
    }
  }
}

export const api = new ApiService();