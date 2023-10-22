import { NestFactory } from '@nestjs/core';
import compression from 'compression';
import 'reflect-metadata';
import { AppModule } from './infrastructure/app/app.module';
import { EnvironmentConfigService } from './infrastructure/environment-config/environment-config.service';

async function bootstrap() {
  //

  const app = await NestFactory.create(AppModule);

  const environmentConfigService = app.get(EnvironmentConfigService);

  //

  app.use(compression());

  //

  const port = environmentConfigService.getRuntimePort();

  await app.listen(port);
}

bootstrap();
