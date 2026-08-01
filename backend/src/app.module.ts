import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';
import { OTPModule } from './otp/otp.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AuthModule,
    EmailModule,
    OTPModule,
  ],
})
export class AppModule {}
