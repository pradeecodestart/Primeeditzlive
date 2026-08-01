export type Role =
  | 'SUPER_ADMIN'
  | 'ADMIN'
  | 'MANAGER'
  | 'STAFF'
  | 'CLIENT'
  | 'GUEST'
  | 'CEO'
  | 'PROJECT_MANAGER'
  | 'EDITOR'
  | 'ACCOUNTANT'
  | 'SALES';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  portal?: string;
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
    portal?: string;
    avatar?: string | null;
  };
  expires: string;
}

export interface LoginResponse {
  user: User;
  token?: string;
  error?: string;
}
