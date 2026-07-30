// Registered Users Store for Seamless Local Auth & Persistence

export interface RegisteredUser {
  id: string;
  email: string;
  password: string; // bcrypt hash or plain text for local fallback
  firstName: string;
  lastName: string;
  role: 'CLIENT' | 'CEO' | 'PROJECT_MANAGER' | 'EDITOR' | 'ACCOUNTANT' | 'SALES';
  company?: string;
  phone?: string;
}

const globalRef = global as unknown as { __registeredUsersStore?: Map<string, RegisteredUser> };

if (!globalRef.__registeredUsersStore) {
  globalRef.__registeredUsersStore = new Map<string, RegisteredUser>();
}

export function saveRegisteredUser(user: RegisteredUser): RegisteredUser {
  if (!globalRef.__registeredUsersStore) {
    globalRef.__registeredUsersStore = new Map<string, RegisteredUser>();
  }
  globalRef.__registeredUsersStore.set(user.email.toLowerCase(), user);
  return user;
}

export function getRegisteredUserByEmail(email: string): RegisteredUser | undefined {
  if (!globalRef.__registeredUsersStore) return undefined;
  return globalRef.__registeredUsersStore.get(email.toLowerCase());
}
