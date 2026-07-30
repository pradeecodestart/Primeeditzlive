export type Role = 'CEO' | 'PROJECT_MANAGER' | 'EDITOR' | 'CLIENT' | 'ACCOUNTANT' | 'SALES';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  avatar?: string | null;
  phone?: string | null;
  company?: string | null;
  address?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthSession {
  user: {
    id: string;
    email: string;
    name: string;
    role: Role;
    avatar?: string | null;
  };
  expires: string;
}

export interface LoginResponse {
  user: User;
  token?: string;
  error?: string;
}
