import { Injectable } from '@nestjs/common';
import { AuthService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppModule {
  constructor(private config: ConfigService) {}
}

// In main.ts, add this for complete setup:
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      process.env.CLIENT_PORTAL_URL,
      process.env.STAFF_PORTAL_URL,
    ],
    credentials: true,
  });

  // Add validation pipes
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}

bootstrap();
