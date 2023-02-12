import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { QuickLinkModule } from './quicklink.module';

async function bootstrap() {
  const app = await NestFactory.create(QuickLinkModule);
  app.useGlobalPipes(new ValidationPipe());
  const config = new DocumentBuilder()
    .setTitle('Quick Links')
    .setDescription('Generate Quick Links')
    .setVersion('1.0')
    .addTag('quick-links')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
