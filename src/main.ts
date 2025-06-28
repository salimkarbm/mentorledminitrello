import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ExceptionsFilter } from './common/exceptions/exception.handler';
import { ConfigService } from '@nestjs/config';
import * as hpp from 'hpp';
import helmet from 'helmet';
import * as compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  // Set security HTTP headers
  app.use([hpp(), compression(), helmet()]);

  app.enableCors();

  app.useGlobalFilters(new ExceptionsFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      skipMissingProperties: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Mentorled mini trello API')
    .setDescription(
      'This API is used for mentorled mini trello.\n\n📘 [GitHub Repository](https://github.com/salimkarbm/mentorledminitrello)\n\n🔗 [Swagger UI](https://mentorledminitrello.onrender.com)',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
  await app.listen(configService.get<number>('PORT', 3000) ?? 3000);
}
bootstrap();
