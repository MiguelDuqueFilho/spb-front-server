import { ValidationPipe, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = new Logger(bootstrap.name);

  app.setGlobalPrefix('api');

  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('SPB Front Server')
    .setDescription('The SPB Front Server API description')
    .setVersion('0.1')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT;

  await app.listen(port, async () => {
    logger.log(`Application is running on: ${await app.getUrl()}`);
  });
}

bootstrap();
