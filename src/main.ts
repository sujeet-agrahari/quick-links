import { RequestMethod, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('/api/v1', {
    exclude: [{ path: '/health', method: RequestMethod.GET }],
  });
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
