#!/bin/bash

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}🚀 Setting up OTP System${NC}\n"

# 1. Start Docker containers
echo -e "${YELLOW}1️⃣  Starting Docker containers...${NC}"
docker-compose up -d
if [ $? -eq 0 ]; then
  echo -e "${GREEN}✅ Docker containers started${NC}\n"
else
  echo -e "${RED}❌ Failed to start Docker containers${NC}"
  exit 1
fi

# 2. Wait for PostgreSQL
echo -e "${YELLOW}2️⃣  Waiting for PostgreSQL...${NC}"
sleep 10

# 3. Setup backend
echo -e "${YELLOW}3️⃣  Setting up backend...${NC}"
cd backend

if [ ! -f .env ]; then
  cat > .env << EOF
DATABASE_URL=postgresql://postprod_user:postprod_password_change_me@localhost:5432/postprod
JWT_SECRET=your-super-secret-jwt-key-min-64-chars-long-for-security-change-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-min-64-chars-long-for-security-change-in-production
RESEND_API_KEY=re_your_resend_api_key_here
FROM_EMAIL=noreply@yourdomain.com
APP_NAME=PostProd Manager Pro
CLIENT_PORTAL_URL=http://localhost:3000
STAFF_PORTAL_URL=http://localhost:3001
PORT=4000
NODE_ENV=development
EOF
  echo -e "${GREEN}✅ Backend .env created${NC}"
fi

if [ ! -d node_modules ]; then
  npm install
fi

# Run Prisma migrations
npx prisma migrate deploy || npx prisma migrate dev --name init
npx prisma generate

echo -e "${GREEN}✅ Backend setup complete${NC}\n"

# 4. Setup frontend
echo -e "${YELLOW}4️⃣  Setting up frontend...${NC}"
cd ../frontend

if [ ! -f .env.local ]; then
  cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_CLIENT_PORTAL_URL=http://localhost:3000
NEXT_PUBLIC_STAFF_PORTAL_URL=http://localhost:3001
EOF
  echo -e "${GREEN}✅ Frontend .env.local created${NC}"
fi

if [ ! -d node_modules ]; then
  npm install
fi

echo -e "${GREEN}✅ Frontend setup complete${NC}\n"

# 5. Summary
echo -e "${GREEN}✅ Setup Complete!${NC}\n"
echo -e "${YELLOW}📝 Next steps:${NC}"
echo "1. Terminal 1 - Backend:"
echo "   cd backend && npm run start:dev"
echo ""
echo "2. Terminal 2 - Frontend:"
echo "   cd frontend && npm run dev"
echo ""
echo -e "${YELLOW}🌐 Access URLs:${NC}"
echo "- Frontend: http://localhost:3000"
echo "- Backend API: http://localhost:4000"
echo "- PostgreSQL: localhost:5432"
echo "- Redis: localhost:6379"
echo ""
echo -e "${YELLOW}📧 Email Service:${NC}"
echo "- Update RESEND_API_KEY in backend/.env"
echo "- Update FROM_EMAIL in backend/.env"
echo ""
echo -e "${YELLOW}🧪 Testing:${NC}"
echo "- Run: ./test-otp-system.sh"
echo ""
