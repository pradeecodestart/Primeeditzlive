import { sendGoogleOAuthVerificationConfirmation } from '../src/lib/emailService.ts';

async function main() {
  console.log('===========================================================');
  console.log('📧 TESTING GOOGLE OAUTH CLIENT EMAIL VERIFICATION CONFIRMATION');
  console.log('===========================================================');

  const result = await sendGoogleOAuthVerificationConfirmation(
    'ultimatefinancesolution89@gmail.com',
    'B Pradeep'
  );

  console.log('Result:', result);
}

main();
