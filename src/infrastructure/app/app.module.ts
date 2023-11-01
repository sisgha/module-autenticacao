import { InMemoryLRUCache } from '@apollo/utils.keyvaluecache';
import { ApolloFederationDriver, ApolloFederationDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';
import { SISGEANestSSOAuthenticationModule } from '@sisgea/nest-sso';
import { AuthenticatedGraphQLGuard } from '@sisgea/nest-sso/dist/infrastructure/guards/gql';
import { ActorContextModule } from '../actor-context';
import { DatabaseModule } from '../database/database.module';
import { DBEventsModule } from '../db-events/db-events.module';
import { EnvironmentConfigModule } from '../environment-config';
import { EventsModule } from '../events/events.module';
import { KCClientModule } from '../kc-client/kc-client.module';
import { MessageBrokerModule } from '../message-broker/message-broker.module';
import { SISGEANestSSOContextModule } from '../sisgea-nest-sso-context';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GqlExceptionFilter } from './filters/GqlExceptionFilter';
import { UsuarioModule } from './modules/usuario/usuario.module';

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
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,

      autoSchemaFile: true,

      introspection: true,

      cache: new InMemoryLRUCache({
        // ~100MiB
        maxSize: Math.pow(2, 20) * 100,
        // 5 minutes (in milliseconds)
        ttl: 5 * 60 * 1000,
      }),
    }),

    //

    SISGEANestSSOContextModule,

    //

    SISGEANestSSOAuthenticationModule,

    //

    KCClientModule,
    DatabaseModule,
    //

    MessageBrokerModule,
    DBEventsModule,

    //

    ActorContextModule,

    //

    UsuarioModule,
  ],

  controllers: [
    //
    AppController,
  ],
  providers: [
    //
    {
      provide: APP_GUARD,
      useClass: AuthenticatedGraphQLGuard,
    },

    {
      provide: APP_FILTER,
      useClass: GqlExceptionFilter,
    },

    AppService,
  ],
})
export class AppModule {}
