import { withAuth, NextRequestWithAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

const STAFF_ROLES = ['CEO', 'PROJECT_MANAGER', 'EDITOR', 'ACCOUNTANT', 'SALES'];

export default withAuth(
  function middleware(request: NextRequestWithAuth) {
    const { pathname } = request.nextUrl;
    const token = request.nextauth.token;

    // Role-based route protection for authenticated users
    if (token) {
      const role = token?.role as string;
      const isStaff = STAFF_ROLES.includes(role);

      if (pathname.startsWith('/staff/login') && !isStaff) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
      if ((pathname === '/login' || pathname === '/register') && isStaff) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }

      if (pathname.startsWith('/analytics') || pathname.startsWith('/settings/users')) {
        if (role !== 'CEO' && role !== 'PROJECT_MANAGER') {
          return NextResponse.redirect(new URL('/dashboard', request.url));
        }
      }

      if (pathname.startsWith('/team')) {
        if (role === 'CLIENT') {
          return NextResponse.redirect(new URL('/dashboard', request.url));
        }
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized({ token, req }) {
        const { pathname } = req.nextUrl;

        const publicRoutes = [
          '/',
          '/login',
          '/register',
          '/signup',
          '/staff/login',
          '/forgot-password',
          '/reset-password',
          '/verify-email',
          '/orders/new',
        ];

        if (pathname.startsWith('/staff/invite/')) {
          return true;
        }

        if (publicRoutes.some((route) => pathname === route)) {
          return true;
        }

        if (pathname.startsWith('/api/auth/')) {
          return true;
        }

        if (
          pathname.startsWith('/api/clients/register') ||
          pathname.startsWith('/api/staff/accept-invite') ||
          pathname.startsWith('/api/orders') ||
          pathname.startsWith('/api/team')
        ) {
          return true;
        }

        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/orders/:path*',
    '/invoices/:path*',
    '/clients/:path*',
    '/chat/:path*',
    '/analytics/:path*',
    '/team/:path*',
    '/settings/:path*',
    '/profile/:path*',
    '/billing/:path*',
  ],
};
