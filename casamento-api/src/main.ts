import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // O header Origin do browser nunca inclui path, apenas scheme+host+port.
  // Extraímos só a origem da FRONTEND_URL para o CORS bater corretamente.
  const frontendOrigin = new URL(
    process.env.FRONTEND_URL ?? 'http://localhost:5173',
  ).origin;

  app.enableCors({
    origin: frontendOrigin,
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.setGlobalPrefix('api');

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
