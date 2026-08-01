// Registered Users Store for Seamless Local Auth & Persistence

export interface RegisteredUser {
  id: string;
  email: string;
  password: string; // bcrypt hash or plain text for local fallback
  firstName: string;
  lastName: string;
  role: string;
  portal?: string;
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

export function clearClientUsersFromStore(): number {
  if (!globalRef.__registeredUsersStore) return 0;
  let count = 0;
  for (const [email, user] of globalRef.__registeredUsersStore.entries()) {
    if (user.portal === 'CLIENT' || user.role === 'CLIENT') {
      globalRef.__registeredUsersStore.delete(email);
      count++;
    }
  }
  return count;
}
