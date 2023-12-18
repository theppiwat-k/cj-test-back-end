import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  /*  SET DEFAULT */
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: false,
  });
  app.use(cookieParser());
  app.enableCors({
    allowedHeaders: ['content-type'],
    origin: 'http://localhost:3000',
    credentials: true,
  });
  const configService = app.get(ConfigService);
  const port = configService.get('PORT');

  /*  SET GLOBAL OPTIONS */
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.useBodyParser('json', { limit: '50mb' });
  app.useBodyParser('urlencoded', { extended: true });

  /*  START APPLICATION */
  console.log(`APP IS STARTING PORT ${port} ...`);
  await app.listen(port);
  console.log(`APP IS LISTENING ON PORT ${port}`);
}
bootstrap();
