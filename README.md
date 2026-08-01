# 🔐 Complete Email OTP Verification System

A production-ready full-stack authentication system with OTP (One-Time Password) verification, built with NestJS, Next.js, PostgreSQL, and TypeScript.

## ✨ Features

### 🔑 Authentication
- ✅ Email/Password Registration & Login
- ✅ OTP-based Email Verification
- ✅ Passwordless OTP Login
- ✅ Password Reset with OTP
- ✅ JWT Tokens (Access + Refresh)
- ✅ Google OAuth Ready
- ✅ Portal-based Access Control (STAFF/CLIENT)

### 🛡️ Security
- ✅ 6-digit Cryptographically Random OTP
- ✅ 10-minute OTP Expiration
- ✅ 5-attempt Lockout Mechanism
- ✅ Bcrypt Password Hashing (10 rounds)
- ✅ JWT Bearer Token Authentication
- ✅ CORS Protection
- ✅ Input Validation & Sanitization
- ✅ Secure Email Templates with Security Warnings

### 📧 Email Integration
- ✅ Production-ready HTML Templates
- ✅ Gradient-based Design
- ✅ Resend Email Service Integration
- ✅ Email Verification OTP
- ✅ Login OTP Email
- ✅ Password Reset OTP Email
- ✅ Welcome Email after Verification

### 🎨 Frontend
- ✅ Beautiful UI with Tailwind CSS
- ✅ OTP Input Component (auto-focus, paste support)
- ✅ Multi-tab Login (Password + OTP)
- ✅ Form Validation (React Hook Form + Zod)
- ✅ Zustand State Management
- ✅ Fully Responsive Design
- ✅ Loading States & Error Handling

### 📊 Backend
- ✅ Modular NestJS Architecture
- ✅ Prisma ORM with PostgreSQL
- ✅ JWT Strategy & Authentication Guards
- ✅ Comprehensive Error Handling
- ✅ Logging & Monitoring Ready
- ✅ RESTful API with 10+ Endpoints

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 12+
- npm or yarn
- Git

### 1. Clone & Setup
```bash
# Clone repository
git clone <repo-url>
cd postprod-manager-pro

# Install dependencies
cd backend && npm install
cd ../frontend && npm install
cd ..
```

### 2. Environment Setup
```bash
# Backend .env
cp backend/.env.example backend/.env

# Update with your values:
DATABASE_URL=postgresql://user:password@localhost:5432/postprod
JWT_SECRET=your-64-character-secret-key-here
JWT_REFRESH_SECRET=your-64-character-refresh-key-here
RESEND_API_KEY=re_your_resend_api_key
FROM_EMAIL=noreply@yourdomain.com
CLIENT_PORTAL_URL=http://localhost:3000
STAFF_PORTAL_URL=http://localhost:3001

# Frontend .env.local
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### 3. Database Setup
```bash
cd backend

# Create database
createdb postprod

# Run migrations
npx prisma migrate dev --name init

# Generate Prisma Client
npx prisma generate
```

### 4. Start Services
```bash
# Terminal 1 - Backend (port 4000)
cd backend
npm run start:dev

# Terminal 2 - Frontend (port 3000)
cd frontend
npm run dev
```

Visit http://localhost:3000 to see the app!

---

## 📋 API Endpoints

### Authentication Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/verify-email-otp` | Verify email with OTP |
| POST | `/auth/resend-email-otp` | Resend verification OTP |
| POST | `/auth/login` | Login with email & password |
| POST | `/auth/request-login-otp` | Request passwordless login OTP |
| POST | `/auth/verify-login-otp` | Verify login OTP |
| POST | `/auth/request-password-reset` | Request password reset OTP |
| POST | `/auth/verify-password-reset-otp` | Verify reset OTP, get reset token |
| POST | `/auth/reset-password` | Complete password reset |
| POST | `/auth/refresh` | Refresh JWT tokens |
| GET | `/auth/me` | Get current user profile (JWT protected) |

---

## 🧪 Testing

### Manual Testing via cURL
```bash
# 1. Register
curl -X POST http://localhost:4000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!",
    "firstName": "John",
    "lastName": "Doe",
    "portal": "CLIENT"
  }'

# 2. Verify Email OTP (use OTP from email)
curl -X POST http://localhost:4000/auth/verify-email-otp \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "otp": "123456"}'

# 3. Login
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!",
    "portal": "CLIENT"
  }'
```

### Frontend Testing
1. **Signup**: http://localhost:3000/signup
2. **Login**: http://localhost:3000/login
3. **Forgot Password**: http://localhost:3000/forgot-password

---

## 📁 Project Structure

```
postprod-manager-pro/
├── backend/
│   ├── src/
│   │   ├── auth/
│   │   │   ├── auth.service.ts        # Auth business logic
│   │   │   ├── auth.controller.ts     # API endpoints
│   │   │   ├── auth.module.ts         # Module setup
│   │   │   ├── jwt.strategy.ts        # JWT authentication
│   │   │   └── jwt-auth.guard.ts      # JWT guard
│   │   ├── otp/
│   │   │   ├── otp.service.ts         # OTP generation & validation
│   │   │   └── otp.module.ts          # Module setup
│   │   ├── email/
│   │   │   ├── email.service.ts       # Email sending (Resend)
│   │   │   └── email.module.ts        # Module setup
│   │   ├── prisma/
│   │   │   └── prisma.service.ts      # Database connection
│   │   ├── app.module.ts              # Root module
│   │   └── main.ts                    # Application entry
│   ├── prisma/
│   │   ├── schema.prisma              # Database schema
│   │   └── migrations/                # Database migrations
│   ├── .env                           # Environment variables
│   └── package.json
│
├── frontend/
│   ├── app/
│   │   └── (auth)/
│   │       ├── signup/page.tsx        # Registration page
│   │       ├── login/page.tsx         # Login page
│   │       └── forgot-password/page.tsx # Password reset page
│   ├── components/
│   │   └── OTPInput.tsx               # OTP input component
│   ├── lib/
│   │   └── api-client.ts              # API client with interceptors
│   ├── store/
│   │   └── authStore.ts               # Zustand auth store
│   ├── .env.local                     # Frontend environment
│   └── package.json
│
├── IMPLEMENTATION_GUIDE.md            # Setup & deployment guide
├── test-otp-system.sh                 # Automated testing script
└── README.md                          # This file
```

---

## 🔒 Security Considerations

### OTP Security
- OTP is 6 random digits generated with `crypto.randomInt()`
- OTP expires after 10 minutes
- Maximum 5 attempts before temporary lockout
- OTP is cleared from database after successful verification
- Attempt counter reset after successful verification

### Password Security
- Minimum 8 characters required
- Hashed with bcrypt using 10 salt rounds
- Never stored in logs or error messages
- Password reset requires OTP verification

### Token Security
- Access tokens expire after 15 minutes
- Refresh tokens expire after 7 days
- Tokens are JWT signed with secret
- Bearer token authentication for protected routes
- Tokens stored in localStorage (can be enhanced to httpOnly cookies)

### Email Security
- Email not revealed on forgot password (privacy protection)
- Security warnings in all OTP emails
- No sensitive information in email subject
- Professional HTML templates with proper security notice

### API Security
- CORS properly configured
- Input validation on all endpoints
- Error messages don't reveal sensitive data
- Rate limiting ready (can be added with redis)
- JWT protection on user endpoints

---

## 🛠️ Environment Variables

### Backend (.env)
```
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/postprod

# JWT
JWT_SECRET=your-super-secret-key-min-64-chars
JWT_REFRESH_SECRET=your-super-secret-refresh-key-min-64-chars

# Email Service
RESEND_API_KEY=re_your_resend_api_key
FROM_EMAIL=noreply@yourdomain.com
APP_NAME=PostProd Manager Pro

# Portal URLs
CLIENT_PORTAL_URL=http://localhost:3000
STAFF_PORTAL_URL=http://localhost:3001

# Server
PORT=4000
NODE_ENV=development
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_CLIENT_PORTAL_URL=http://localhost:3000
NEXT_PUBLIC_STAFF_PORTAL_URL=http://localhost:3001
```

---

## 📊 Database Schema

### User Table
```sql
CREATE TABLE users (
  id            VARCHAR(255) PRIMARY KEY,
  email         VARCHAR(255) UNIQUE NOT NULL,
  passwordHash  VARCHAR(255) NOT NULL,
  firstName     VARCHAR(255) NOT NULL,
  lastName      VARCHAR(255) NOT NULL,
  role          VARCHAR(50) DEFAULT 'CLIENT',
  portal        VARCHAR(50) DEFAULT 'CLIENT',
  isActive      BOOLEAN DEFAULT true,
  isEmailVerified BOOLEAN DEFAULT false,
  
  -- Email OTP
  emailOtp        VARCHAR(6),
  emailOtpExpires TIMESTAMP,
  emailOtpAttempts INT DEFAULT 0,
  
  -- Login OTP
  loginOtp        VARCHAR(6),
  loginOtpExpires TIMESTAMP,
  loginOtpAttempts INT DEFAULT 0,
  
  -- Password Reset
  resetPasswordOtp VARCHAR(6),
  resetPasswordOtpExpires TIMESTAMP,
  resetPasswordOtpAttempts INT DEFAULT 0,
  
  -- Timestamps
  createdAt       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt       TIMESTAMP,
  emailVerifiedAt TIMESTAMP,
  lastLoginAt     TIMESTAMP
);
```

---

## 🚢 Production Deployment

### Before Deploying
1. Generate new JWT secrets (min 64 characters)
2. Set NODE_ENV=production
3. Use production database with backups
4. Enable HTTPS/SSL everywhere
5. Set up production email service (Resend account)
6. Update portal URLs to production domains
7. Enable CORS only for production domains
8. Set up rate limiting (Redis recommended)
9. Configure monitoring & logging
10. Enable database replication & failover

### Docker Deployment
```dockerfile
# Backend Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 4000
CMD ["npm", "run", "start:prod"]

# Frontend Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start"]
```

### Environment Variables (Production)
```bash
# Use AWS Secrets Manager, Vault, or similar
# Never commit secrets to version control
```

---

## 🐛 Troubleshooting

### Database Connection Failed
- Ensure PostgreSQL is running: `psql --version`
- Check DATABASE_URL is correct
- Verify user has correct permissions
- Try creating test database: `createdb testdb`

### Email Not Sending
- Verify RESEND_API_KEY is correct
- Check email format is valid
- Ensure Resend account is active
- Check email logs in Resend dashboard

### JWT Errors
- JWT_SECRET should be min 64 characters
- Ensure secret matches in all places
- Check token hasn't expired
- Verify Authorization header format: `Bearer <token>`

### CORS Errors
- Ensure frontend URL is in CORS origins
- Check credentials: true is set
- Verify request headers include Content-Type

### OTP Not Working
- Check OTP hasn't expired (10 minutes)
- Verify OTP format is exactly 6 digits
- Check attempt limit (5 max)
- Look for OTP in email spam folder

---

## 📈 Performance Optimization

### Recommended Additions
1. **Caching**: Redis for OTP storage & rate limiting
2. **Database**: Add indexes on email & createdAt
3. **CDN**: CloudFront for static assets
4. **Monitoring**: Sentry for error tracking
5. **Analytics**: PostHog or Mixpanel
6. **Background Jobs**: Bull for email queue

### Load Testing
```bash
# Using Apache Bench
ab -n 1000 -c 100 http://localhost:4000/auth/me \
  -H "Authorization: Bearer <token>"
```

---

## 📝 API Response Examples

### Successful Registration
```json
{
  "message": "User registered. Please verify your email.",
  "email": "user@example.com"
}
```

### Successful Email Verification
```json
{
  "message": "Email verified successfully",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "isEmailVerified": true
  },
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

### Error Response
```json
{
  "statusCode": 400,
  "message": "Invalid OTP",
  "error": "Bad Request"
}
```

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📄 License

This project is licensed under MIT License - see LICENSE file for details

---

## 💡 Future Enhancements

- [ ] Two-Factor Authentication (2FA) with TOTP
- [ ] SMS OTP support (Twilio)
- [ ] Biometric authentication
- [ ] Session management
- [ ] IP-based security checks
- [ ] Device tracking
- [ ] Email change verification
- [ ] Account deactivation
- [ ] Audit logging
- [ ] Analytics dashboard

---

## 📞 Support & Contact

- **Documentation**: See IMPLEMENTATION_GUIDE.md
- **Issues**: GitHub Issues
- **Discussions**: GitHub Discussions
- **Email**: support@yourdomain.com

---

## 🙏 Acknowledgments

Built with:
- [NestJS](https://nestjs.com/) - Backend framework
- [Next.js](https://nextjs.org/) - Frontend framework
- [Prisma](https://www.prisma.io/) - ORM
- [Resend](https://resend.com/) - Email service
- [TypeScript](https://www.typescriptlang.org/) - Language
- [PostgreSQL](https://www.postgresql.org/) - Database

---

**Happy Coding! 🚀**
