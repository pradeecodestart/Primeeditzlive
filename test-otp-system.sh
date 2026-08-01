#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

API_URL="http://localhost:4000"
EMAIL="testuser@example.com"
PASSWORD="SecurePass123!"

echo -e "${YELLOW}🧪 OTP System Testing Script${NC}\n"

# Test 1: Register
echo -e "${YELLOW}1️⃣  Testing Registration...${NC}"
REGISTER_RESPONSE=$(curl -s -X POST $API_URL/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "'$EMAIL'",
    "password": "'$PASSWORD'",
    "firstName": "Test",
    "lastName": "User",
    "portal": "CLIENT"
  }')

if echo "$REGISTER_RESPONSE" | grep -q "Please verify your email"; then
  echo -e "${GREEN}✅ Registration successful${NC}"
  echo "$REGISTER_RESPONSE" | jq '.'
else
  echo -e "${RED}❌ Registration failed${NC}"
  echo "$REGISTER_RESPONSE" | jq '.'
  exit 1
fi

# Test 2: Resend OTP
echo -e "\n${YELLOW}2️⃣  Testing Resend OTP...${NC}"
RESEND_RESPONSE=$(curl -s -X POST $API_URL/auth/resend-email-otp \
  -H "Content-Type: application/json" \
  -d '{"email": "'$EMAIL'"}')

if echo "$RESEND_RESPONSE" | grep -q "OTP resent"; then
  echo -e "${GREEN}✅ Resend OTP successful${NC}"
else
  echo -e "${RED}❌ Resend OTP failed${NC}"
  echo "$RESEND_RESPONSE" | jq '.'
fi

# Test 3: Verify Email OTP (needs manual OTP from email)
echo -e "\n${YELLOW}3️⃣  Testing Email OTP Verification (Manual)${NC}"
echo -e "${YELLOW}Please check your email and enter the OTP:${NC}"
read -p "Enter OTP: " OTP

VERIFY_EMAIL_RESPONSE=$(curl -s -X POST $API_URL/auth/verify-email-otp \
  -H "Content-Type: application/json" \
  -d '{"email": "'$EMAIL'", "otp": "'$OTP'"}')

if echo "$VERIFY_EMAIL_RESPONSE" | grep -q "Email verified successfully"; then
  echo -e "${GREEN}✅ Email verification successful${NC}"
  ACCESS_TOKEN=$(echo "$VERIFY_EMAIL_RESPONSE" | jq -r '.accessToken')
  REFRESH_TOKEN=$(echo "$VERIFY_EMAIL_RESPONSE" | jq -r '.refreshToken')
  echo "Access Token: ${ACCESS_TOKEN:0:30}..."
else
  echo -e "${RED}❌ Email verification failed${NC}"
  echo "$VERIFY_EMAIL_RESPONSE" | jq '.'
  exit 1
fi

# Test 4: Login with password
echo -e "\n${YELLOW}4️⃣  Testing Password Login...${NC}"
LOGIN_RESPONSE=$(curl -s -X POST $API_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "'$EMAIL'",
    "password": "'$PASSWORD'",
    "portal": "CLIENT"
  }')

if echo "$LOGIN_RESPONSE" | grep -q "Login successful"; then
  echo -e "${GREEN}✅ Password login successful${NC}"
else
  echo -e "${RED}❌ Password login failed${NC}"
  echo "$LOGIN_RESPONSE" | jq '.'
fi

# Test 5: Get profile with JWT
echo -e "\n${YELLOW}5️⃣  Testing Get Profile (JWT Protected)...${NC}"
PROFILE_RESPONSE=$(curl -s -X GET $API_URL/auth/me \
  -H "Authorization: Bearer $ACCESS_TOKEN")

if echo "$PROFILE_RESPONSE" | grep -q "$EMAIL"; then
  echo -e "${GREEN}✅ Get profile successful${NC}"
  echo "$PROFILE_RESPONSE" | jq '.user | {id, email, firstName, lastName, portal}'
else
  echo -e "${RED}❌ Get profile failed${NC}"
  echo "$PROFILE_RESPONSE" | jq '.'
fi

# Test 6: Request Login OTP
echo -e "\n${YELLOW}6️⃣  Testing Request Login OTP...${NC}"
REQUEST_LOGIN_OTP=$(curl -s -X POST $API_URL/auth/request-login-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "'$EMAIL'",
    "portal": "CLIENT"
  }')

if echo "$REQUEST_LOGIN_OTP" | grep -q "Login OTP sent"; then
  echo -e "${GREEN}✅ Login OTP request successful${NC}"
else
  echo -e "${RED}❌ Login OTP request failed${NC}"
  echo "$REQUEST_LOGIN_OTP" | jq '.'
fi

# Test 7: Verify Login OTP
echo -e "\n${YELLOW}7️⃣  Testing Verify Login OTP (Manual)${NC}"
echo -e "${YELLOW}Please check your email for the login OTP:${NC}"
read -p "Enter OTP: " LOGIN_OTP

VERIFY_LOGIN_OTP=$(curl -s -X POST $API_URL/auth/verify-login-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "'$EMAIL'",
    "otp": "'$LOGIN_OTP'",
    "portal": "CLIENT"
  }')

if echo "$VERIFY_LOGIN_OTP" | grep -q "Login successful"; then
  echo -e "${GREEN}✅ Login OTP verification successful${NC}"
else
  echo -e "${RED}❌ Login OTP verification failed${NC}"
  echo "$VERIFY_LOGIN_OTP" | jq '.'
fi

# Test 8: Request Password Reset
echo -e "\n${YELLOW}8️⃣  Testing Request Password Reset...${NC}"
REQUEST_RESET=$(curl -s -X POST $API_URL/auth/request-password-reset \
  -H "Content-Type: application/json" \
  -d '{"email": "'$EMAIL'"}')

if echo "$REQUEST_RESET" | grep -q "Password reset code sent"; then
  echo -e "${GREEN}✅ Password reset request successful${NC}"
else
  echo -e "${RED}❌ Password reset request failed${NC}"
  echo "$REQUEST_RESET" | jq '.'
fi

# Test 9: Verify Password Reset OTP
echo -e "\n${YELLOW}9️⃣  Testing Verify Password Reset OTP (Manual)${NC}"
echo -e "${YELLOW}Please check your email for the password reset OTP:${NC}"
read -p "Enter OTP: " RESET_OTP

VERIFY_RESET_OTP=$(curl -s -X POST $API_URL/auth/verify-password-reset-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "'$EMAIL'",
    "otp": "'$RESET_OTP'"
  }')

if echo "$VERIFY_RESET_OTP" | grep -q "resetToken"; then
  echo -e "${GREEN}✅ Password reset OTP verification successful${NC}"
  RESET_TOKEN=$(echo "$VERIFY_RESET_OTP" | jq -r '.resetToken')
else
  echo -e "${RED}❌ Password reset OTP verification failed${NC}"
  echo "$VERIFY_RESET_OTP" | jq '.'
  exit 1
fi

# Test 10: Reset Password
echo -e "\n${YELLOW}🔟 Testing Reset Password...${NC}"
RESET_PASSWORD=$(curl -s -X POST $API_URL/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "resetToken": "'$RESET_TOKEN'",
    "newPassword": "NewSecurePass456!"
  }')

if echo "$RESET_PASSWORD" | grep -q "Password reset successfully"; then
  echo -e "${GREEN}✅ Password reset successful${NC}"
else
  echo -e "${RED}❌ Password reset failed${NC}"
  echo "$RESET_PASSWORD" | jq '.'
fi

# Test 11: Refresh Token
echo -e "\n${YELLOW}1️⃣1️⃣  Testing Refresh Token...${NC}"
REFRESH=$(curl -s -X POST $API_URL/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken": "'$REFRESH_TOKEN'"}')

if echo "$REFRESH" | grep -q "accessToken"; then
  echo -e "${GREEN}✅ Token refresh successful${NC}"
  echo "New Access Token: $(echo "$REFRESH" | jq -r '.accessToken' | cut -c1-30)..."
else
  echo -e "${RED}❌ Token refresh failed${NC}"
  echo "$REFRESH" | jq '.'
fi

echo -e "\n${GREEN}✅ All tests completed!${NC}\n"
