import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Role } from '@/types/auth';

export function useAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const isLoading = status === 'loading';
  const isAuthenticated = !!session?.user;
  const user = session?.user;
  const role = (user as any)?.role as Role | undefined;

  const login = async (email: string, password: string) => {
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });
    if (result?.error) {
      throw new Error(result.error);
    }
    router.push('/dashboard');
  };

  const logoutUser = async () => {
    // Redirect to Landing Page / Worked Footages Gallery Showcase on logout
    await signOut({ callbackUrl: '/' });
  };

  return {
    user,
    role,
    isAuthenticated,
    isLoading,
    login,
    logout: logoutUser,
  };
}
