import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import type { INestApplication } from '@nestjs/common';

let app: INestApplication;

async function bootstrap() {
  if (!app) {
    app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn'],
    });
    app.enableCors({
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      allowedHeaders: 'Content-Type, Authorization',
      credentials: true,
    });
    try {
      await app.init();
    } catch (err: any) {
      console.error('[Vercel] init error:', err?.message ?? err);
    }
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await bootstrap();
  const httpAdapter = app.getHttpAdapter();
  httpAdapter.getInstance()(req as any, res as any);
}

