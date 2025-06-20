export interface User {
  id: string;
  username: string;
  email: string;
}

export interface ShortenedUrl {
  _id: string;
  originalUrl: string;
  shortCode: string;
  createdBy: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
}