import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.use(cookieParser());
  app.enableCors({
    origin: process.env.FRONTEND_ORIGIN_URL,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Pass the HTTPS options as the second argument to the 'listen' method
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0', () => {
    console.log(
      'Server is running on http://localhost:' + (process.env.PORT ?? 3000),
    );
  });
}
bootstrap();
