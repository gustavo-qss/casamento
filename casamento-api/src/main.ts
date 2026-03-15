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

  const allowed = [
    process.env.FRONTEND_URL,
    /\.netlify\.app$/,        // qualquer preview do Netlify
  ].filter(Boolean);

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowed.some(o => typeof o === 'string' ? o === origin : o.test(origin))) {
        callback(null, true);
      } else {
        callback(new Error(`CORS bloqueado: ${origin}`));
      }
    },
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.setGlobalPrefix('api');

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
