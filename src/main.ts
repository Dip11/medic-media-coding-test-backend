import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app: NestExpressApplication = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  const config: ConfigService = app.get(ConfigService);
  const port: number = config.get<number>('_PORT');

  /**
   * Setup Swagger for API Documentation
   */
  const documentBuilderConfig = new DocumentBuilder()
    .setTitle('WMS-API')
    .setDescription(
      'This document explains APIs used to make request to WMS backend.',
    )
    .setVersion('1.0')
    .addTag('wms-api')
    .build();

  const document = SwaggerModule.createDocument(app, documentBuilderConfig);
  SwaggerModule.setup('api/doc', app, document);

  app.enableCors();
  app.setGlobalPrefix('api');

  await app.listen(port, () => {
    console.log('[WMS-API]', `http://localhost:${port}/api`);
    console.log('[Connected DB]', process.env.DATABASE_HOST);
  });
}

bootstrap();
