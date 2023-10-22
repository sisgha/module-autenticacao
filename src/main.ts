import { NestFactory } from '@nestjs/core';
import { AppModule } from './infrastructure/app/app.module';
import compression from 'compression';

async function bootstrap() {
  const PORT = process.env.PORT ?? 3001;

  const app = await NestFactory.create(AppModule);

  app.use(compression());

  await app.listen(PORT);
}

bootstrap();
