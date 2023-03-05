import { RequestMethod, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strips away any unwanted property
      forbidNonWhitelisted: true, // throw validation error for unwanted property
      // transform: true, // transform the property with the defined dto type but impacts performance
    }),
  );
  app.setGlobalPrefix('/api/v1', {
    exclude: [{ path: '/health', method: RequestMethod.GET }],
  });

  /* This is setting up the swagger documentation for the API. */
  const config = new DocumentBuilder()
    .setTitle('Quick Links')
    .setDescription('Generate Quick Links')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  // expose swagger docs at /api
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  await app.listen(3000);
}
bootstrap();
