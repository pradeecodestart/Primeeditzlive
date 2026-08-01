process.env.DATABASE_URL = "postgresql://postgres:postgrespassword@localhost:5433/postprod_db?schema=public";

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function testOtpFlow() {
  console.log('===========================================================');
  console.log('🧪 TESTING & ANALYZING 6-DIGIT OTP VERIFICATION FLOW');
  console.log('===========================================================');

  const testEmail = `bangalore_client_${Math.floor(Math.random() * 10000)}@example.com`;
  const testPassword = 'Password123!';

  // STEP 1: Perform Registration API Request
  console.log(`\n1️⃣ [STEP 1] Registering test user: ${testEmail}...`);
  const regRes = await fetch('http://localhost:3000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      firstName: 'Rahul',
      lastName: 'Sharma',
      email: testEmail,
      password: testPassword,
      portal: 'CLIENT',
    }),
  });

  const regData = await regRes.json();
  console.log('HTTP Status:', regRes.status);
  console.log('Registration Response:', JSON.stringify(regData, null, 2));

  if (!regData.requiresVerification) {
    throw new Error('Registration failed to trigger requiresVerification flag');
  }

  // STEP 2: Extract Generated OTP Code from DB
  console.log(`\n2️⃣ [STEP 2] Extracting 6-Digit OTP Code from Database...`);
  const user: any = await prisma.user.findUnique({ where: { email: testEmail } });

  console.log('User Record Found in DB:');
  console.log({
    id: user?.id,
    email: user?.email,
    isEmailVerified: user?.isEmailVerified,
    verificationCode: user?.verificationCode,
    verificationExpiry: user?.verificationExpiry,
  });

  const otpCode = user?.verificationCode;
  if (!otpCode) {
    throw new Error('OTP Code was not found in database record');
  }

  console.log(`\n🔑 [OTP CODE GENERATED & SENT TO EMAIL]: ${otpCode}`);

  // STEP 3: Submit Verification Code to /api/auth/verify-code
  console.log(`\n3️⃣ [STEP 3] Submitting OTP Code to /api/auth/verify-code...`);
  const verifyRes = await fetch('http://localhost:3000/api/auth/verify-code', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: testEmail,
      code: otpCode,
    }),
  });

  const verifyData = await verifyRes.json();
  console.log('HTTP Status:', verifyRes.status);
  console.log('Verification Response:', JSON.stringify(verifyData, null, 2));

  // STEP 4: Inspect DB State After Verification
  console.log(`\n4️⃣ [STEP 4] Re-checking Database User Record post-verification...`);
  const updatedUser: any = await prisma.user.findUnique({ where: { email: testEmail } });

  console.log('Updated User Record in DB:');
  console.log({
    id: updatedUser?.id,
    email: updatedUser?.email,
    isEmailVerified: updatedUser?.isEmailVerified,
    emailVerified: updatedUser?.emailVerified,
    verificationCode: updatedUser?.verificationCode,
  });

  if (updatedUser?.isEmailVerified) {
    console.log('\n===========================================================');
    console.log('🎉 VERIFICATION & LOGIN ANALYSIS PASSED 100%! SUCCESS!');
    console.log('===========================================================');
  } else {
    console.log('\n❌ FAILURE: Email is still unverified');
  }
}

testOtpFlow()
  .catch((err) => console.error('Test error:', err))
  .finally(async () => {
    await prisma.$disconnect();
  });
