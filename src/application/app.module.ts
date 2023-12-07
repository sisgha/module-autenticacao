import { InMemoryLRUCache } from '@apollo/utils.keyvaluecache';
import { ApolloFederationDriver, ApolloFederationDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';
import { SISGEANestSSOAuthenticationModule } from '@sisgea/sso-nest-client';
import { AuthenticatedGraphQLGuard } from '@sisgea/sso-nest-client/dist/application/gql';
import { ActorContextModule } from '../infrastructure/actor-context';
import { DatabaseModule } from '../infrastructure/database/database.module';
import { DBEventsModule } from '../infrastructure/db-events/db-events.module';
import { EnvironmentConfigModule } from '../infrastructure/environment-config';
import { EventsModule } from '../infrastructure/events/events.module';
import { GqlExceptionFilter } from '../infrastructure/filters/GqlExceptionFilter';
import { KCClientModule } from '../infrastructure/kc-client';
import { MessageBrokerModule } from '../infrastructure/message-broker/message-broker.module';
import { SISGEAAutorizacaoConnectContainerModule } from '../infrastructure/sisgea-autorizacao-connect-container/sisgea-autorizacao-connect-container.module';
import { SISGEANestSSOContextModule } from '../infrastructure/sisgea-nest-sso-context';
import { AppController } from './app.controller';
import { AppService } from './app.service';
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

    SISGEAAutorizacaoConnectContainerModule,

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
