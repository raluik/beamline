process.env.NODE_ENV = process.env.NODE_ENV ?? 'development';

import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, { cors: true });

  const config = new DocumentBuilder().setTitle('Beamline').setVersion('1.0').build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('documentation', app, document);
  app.enableCors();
  await app.listen(3000);
}
bootstrap();
