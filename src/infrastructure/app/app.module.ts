import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { EventsModule } from '../events/events.module';
import { EnvironmentConfigModule } from '../environment-config/environment-config.module';

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

    //
  ],

  controllers: [
    //
    AppController,
  ],
  providers: [
    //
    AppService,
  ],
})
export class AppModule {}
