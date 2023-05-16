import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Docs')
    .setDescription('The API documentation')
    .setVersion('1.0')
    .addTag('Main API', 'API documentation')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  app.enableCors({ origin: process.env.APP_URL });
  await app.listen(5678);
}
bootstrap();
