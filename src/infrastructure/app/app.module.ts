import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthenticatedHTTPGuard } from '@sisgea/nest-sso/dist/infrastructure/guards/http';
import { DatabaseModule } from '../database/database.module';
import { EnvironmentConfigModule } from '../environment-config';
import { EventsModule } from '../events/events.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpExceptionFilter } from './filters/HttpExceptionFilter';
import { SISGEANestSSOContextModule } from './sisgea-nest-sso-context';
import { SISGEANestSSOAuthenticationModule } from '@sisgea/nest-sso';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60,
          limit: 10,
        },
      ],
    }),

    ScheduleModule.forRoot(),

    EventsModule.forRoot(),

    EnvironmentConfigModule,

    SISGEANestSSOContextModule,

    //

    SISGEANestSSOAuthenticationModule,

    //

    DatabaseModule,

    //
  ],

  controllers: [
    //
    AppController,
  ],
  providers: [
    //
    {
      provide: APP_GUARD,
      useClass: AuthenticatedHTTPGuard,
    },

    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },

    AppService,
  ],
})
export class AppModule {}
