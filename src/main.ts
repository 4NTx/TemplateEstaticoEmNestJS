import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import fastifyHelmet from '@fastify/helmet';
import fastifyCors from '@fastify/cors';
import fastifyStatic from '@fastify/static';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );

  app.register(fastifyStatic, {
    root: join(__dirname, '..', 'public', 'out'),
    prefix: '/',
  });

  await app.register(fastifyHelmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", 'https:', "'unsafe-inline'"],
        fontSrc: ["'self'", 'https:', 'data:'],
        imgSrc: ['data:', 'https:', 'http://127.0.0.1:3000'],
        scriptSrc: ["'self'", 'https:', "'unsafe-inline'",],
      }
    }
  });

  await app.register(fastifyCors, {
    origin: true,
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Authorization",
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "Recaptcha"
    ],
    credentials: true,
  });

  await app.listen(3000, '0.0.0.0');
  console.log(`Aplicação rodando em: ${await app.getUrl()}`);
}
bootstrap();
