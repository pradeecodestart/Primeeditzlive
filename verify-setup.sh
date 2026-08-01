#!/bin/bash

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}🔍 Verifying OTP System Setup${NC}\n"

# Check Node.js
echo -n "Checking Node.js... "
if command -v node &> /dev/null; then
  NODE_VERSION=$(node --version)
  echo -e "${GREEN}✓ $NODE_VERSION${NC}"
else
  echo -e "${RED}✗ Node.js not found${NC}"
fi

# Check npm
echo -n "Checking npm... "
if command -v npm &> /dev/null; then
  NPM_VERSION=$(npm --version)
  echo -e "${GREEN}✓ npm $NPM_VERSION${NC}"
else
  echo -e "${RED}✗ npm not found${NC}"
fi

# Check Git
echo -n "Checking Git... "
if command -v git &> /dev/null; then
  GIT_VERSION=$(git --version)
  echo -e "${GREEN}✓ $GIT_VERSION${NC}"
else
  echo -e "${RED}✗ Git not found${NC}"
fi

# Check Docker
echo -n "Checking Docker... "
if command -v docker &> /dev/null; then
  DOCKER_VERSION=$(docker --version)
  echo -e "${GREEN}✓ $DOCKER_VERSION${NC}"
else
  echo -e "${RED}✗ Docker not found${NC}"
fi

# Check files exist
echo -e "\n${YELLOW}Checking files...${NC}"
echo -n "  backend/src/auth/auth.service.ts... "
[ -f "backend/src/auth/auth.service.ts" ] && echo -e "${GREEN}✓${NC}" || echo -e "${RED}✗${NC}"

echo -n "  frontend/app/(auth)/signup/page.tsx... "
[ -f "frontend/app/(auth)/signup/page.tsx" ] && echo -e "${GREEN}✓${NC}" || echo -e "${RED}✗${NC}"

echo -n "  README.md... "
[ -f "README.md" ] && echo -e "${GREEN}✓${NC}" || echo -e "${RED}✗${NC}"

echo -e "\n${GREEN}✅ Verification complete!${NC}\n"
