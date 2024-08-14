import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app: NestExpressApplication = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  const config: ConfigService = app.get(ConfigService);
  const port: number = config.get<number>('_PORT');

  // app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.enableCors();
  app.setGlobalPrefix('api');

  await app.listen(port, () => {
    console.log('[WMS-API]', `http://localhost:${port}/api`);
    console.log('[Connected DB]', process.env.DATABASE_HOST);
  });
}

bootstrap();
