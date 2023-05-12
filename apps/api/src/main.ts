/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';

import { AppModule } from './app/app.module';
import { http } from '@google-cloud/functions-framework';
import express from 'express';

const server = express();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  const globalPrefix = '';
  app.setGlobalPrefix(globalPrefix);

  // enable cors
  app.enableCors();

  // return app.init();
  return app;
}

bootstrap().then(
  async (app) => {
    const port = 3333;
    await app.listen(port);
    Logger.log(`🚀 Application is running on: http://localhost:${port}/`);

    process.on('exit', () => app.close());
  },
  (e) => {
    Logger.log('Failed to start application');
    Logger.log(e);
    throw e;
  }
);

// run on gcloud function
http('funcLooper', server);
