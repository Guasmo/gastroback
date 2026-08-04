import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from '../src/app.module';
import express from 'express';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import type { INestApplication } from '@nestjs/common';

const expressApp = express();
let nestApp: INestApplication | null = null;

async function bootstrap() {
  if (!nestApp) {
    nestApp = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressApp),
      { logger: ['error', 'warn'] },
    );
    nestApp.enableCors({
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      allowedHeaders: 'Content-Type, Authorization',
      credentials: true,
    });
    await nestApp.init();
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await bootstrap();
  expressApp(req as any, res as any);
}

