process.env.DATABASE_URL = "postgresql://postgres:postgrespassword@localhost:5433/postprod_db?schema=public";

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function testLinkVerificationFlow() {
  console.log('===========================================================');
  console.log('🧪 TESTING 1-CLICK EMAIL LINK VERIFICATION SYSTEM');
  console.log('===========================================================');

  const testEmail = `bangalore_link_${Math.floor(Math.random() * 10000)}@example.com`;
  const testPassword = 'Password123!';

  // STEP 1: Register User
  console.log(`\n1️⃣ [STEP 1] Registering user: ${testEmail}...`);
  const regRes = await fetch('http://localhost:3000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      firstName: 'Anand',
      lastName: 'Kumar',
      email: testEmail,
      password: testPassword,
      portal: 'CLIENT',
    }),
  });

  const regData = await regRes.json();
  console.log('Registration Status:', regRes.status);
  console.log('Registration Response:', JSON.stringify(regData, null, 2));

  // STEP 2: Extract 1-Click Verification Token from DB
  console.log(`\n2️⃣ [STEP 2] Fetching 1-Click Verification Token from DB...`);
  const user: any = await prisma.user.findUnique({ where: { email: testEmail } });

  console.log('DB User Record:');
  console.log({
    id: user?.id,
    email: user?.email,
    isEmailVerified: user?.isEmailVerified,
    emailVerificationToken: user?.emailVerificationToken,
    emailVerificationExpires: user?.emailVerificationExpires,
  });

  const token = user?.emailVerificationToken;
  if (!token) {
    throw new Error('Verification token not found in user database record');
  }

  console.log(`\n🔗 [1-CLICK VERIFICATION LINK GENERATED]: http://localhost:3000/verify-email?token=${token}`);

  // STEP 3: Call GET /api/auth/verify-email?token=...
  console.log(`\n3️⃣ [STEP 3] Simulating Client clicking 1-click email link...`);
  const verifyRes = await fetch(`http://localhost:3000/api/auth/verify-email?token=${token}`);
  const verifyData = await verifyRes.json();

  console.log('HTTP Status:', verifyRes.status);
  console.log('Verification Link Response:', JSON.stringify(verifyData, null, 2));

  // STEP 4: Inspect DB Post-Verification
  console.log(`\n4️⃣ [STEP 4] Re-checking Database User Record post-link verification...`);
  const updatedUser: any = await prisma.user.findUnique({ where: { email: testEmail } });

  console.log('Updated DB User Record:');
  console.log({
    id: updatedUser?.id,
    email: updatedUser?.email,
    isEmailVerified: updatedUser?.isEmailVerified,
    emailVerifiedAt: updatedUser?.emailVerifiedAt,
    emailVerificationToken: updatedUser?.emailVerificationToken,
  });

  if (updatedUser?.isEmailVerified && updatedUser?.emailVerifiedAt) {
    console.log('\n===========================================================');
    console.log('🎉 1-CLICK EMAIL LINK VERIFICATION TEST PASSED 100%! SUCCESS!');
    console.log('===========================================================');
  } else {
    console.log('\n❌ FAILURE: Email is still unverified');
  }
}

testLinkVerificationFlow()
  .catch((e) => console.error('Test error:', e))
  .finally(async () => {
    await prisma.$disconnect();
  });
