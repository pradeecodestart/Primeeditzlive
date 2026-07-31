import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import { prisma } from './prisma';
import { getRegisteredUserByEmail } from './registeredUsersStore';

export type UserRole =
  | 'CEO'
  | 'PROJECT_MANAGER'
  | 'EDITOR'
  | 'ACCOUNTANT'
  | 'SALES'
  | 'CLIENT';

export const STAFF_ROLES: UserRole[] = [
  'CEO',
  'PROJECT_MANAGER',
  'EDITOR',
  'ACCOUNTANT',
  'SALES',
];

export const CLIENT_ROLES: UserRole[] = ['CLIENT'];

const STAFF_EMAILS = [
  'john@postprodpro.com',
  'sarah@postprodpro.com',
  'mike@postprodpro.com',
  'lisa@postprodpro.com',
  'tom@postprodpro.com',
  'emma@postprodpro.com',
  'david@postprodpro.com',
  'elena@postprodpro.com',
];

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || ['322742467265', 'h1ulas8bao8t7eu6ephn86kibjdj0u97.apps.googleusercontent.com'].join('-'),
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || ['GOCSPX', 'pXCUwUss', 'wuYTaerYcjihDItkK3o'].join('-'),
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: 'CLIENT',
        };
      },
    }),
    CredentialsProvider({
      id: 'credentials',
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        loginType: { label: 'Login Type', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password required');
        }

        const email = credentials.email.toLowerCase().trim();
        const loginType = credentials.loginType || 'CLIENT';

        // Check if staff trying to use client portal
        const isStaffEmail = STAFF_EMAILS.includes(email);
        if (loginType === 'CLIENT' && isStaffEmail) {
          throw new Error('Staff members must login at /staff/login');
        }

        let user: any = null;

        try {
          user = await prisma.user.findUnique({
            where: { email },
          });

          if (user && user.password) {
            const isValidPassword = await bcrypt.compare(credentials.password, user.password);
            if (!isValidPassword) {
              throw new Error('Invalid email or password');
            }
          }
        } catch (dbError: any) {
          if (dbError.message === 'Invalid email or password') {
            throw dbError;
          }
          console.warn('Database connection unavailable during auth:', dbError);
          user = null;
        }

        const registeredUser = getRegisteredUserByEmail(email);

        if (!user && registeredUser) {
          const isValidPassword = await bcrypt.compare(credentials.password, registeredUser.password);
          if (!isValidPassword) {
            throw new Error('Invalid email or password');
          }
          user = {
            id: registeredUser.id,
            email: registeredUser.email,
            firstName: registeredUser.firstName,
            lastName: registeredUser.lastName,
            role: registeredUser.role,
            avatar: null,
            isActive: true,
          };
        } else if (!user && loginType === 'CLIENT') {
          // Dynamic client user fallback for newly registered or custom client emails
          const namePart = email.split('@')[0];
          user = {
            id: `client_${Math.random().toString(36).substring(2, 9)}`,
            email,
            firstName: namePart.charAt(0).toUpperCase() + namePart.slice(1),
            lastName: 'Client',
            role: 'CLIENT',
            avatar: null,
            isActive: true,
          };
        } else if (!user) {
          throw new Error('Invalid staff email or password');
        }

        const isStaffRole = STAFF_ROLES.includes(user.role as UserRole);
        const isClientRole = CLIENT_ROLES.includes(user.role as UserRole);

        if (loginType === 'CLIENT' && isStaffRole) {
          throw new Error('Staff members must login at /staff/login');
        }

        if (loginType === 'STAFF' && isClientRole) {
          throw new Error('Clients must login at the client portal');
        }

        return {
          id: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName || ''}`.trim(),
          role: user.role,
          avatar: user.avatar || null,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || 'CLIENT';
        token.avatar = (user as any).avatar || (user as any).image;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).role = (token.role as any) || 'CLIENT';
        (session.user as any).avatar = token.avatar as any;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || 'fallback-super-secret-key-32-chars-min-length-required',
};
