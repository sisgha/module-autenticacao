import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';
import { DatabaseModule } from '../database/database.module';
import { EnvironmentConfigModule } from '../environment-config/environment-config.module';
import { EventsModule } from '../events/events.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

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

    DatabaseModule,
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
