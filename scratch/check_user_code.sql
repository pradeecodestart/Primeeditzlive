SELECT email, "verificationCode", "emailVerificationToken", "isEmailVerified", "createdAt" 
FROM "User" 
ORDER BY "createdAt" DESC 
LIMIT 5;
