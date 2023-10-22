import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IConfig } from '../../domain';
import { join } from 'path';
import { DataSourceOptions } from 'typeorm';

@Injectable()
export class EnvironmentConfigService implements IConfig {
  constructor(
    // ...
    private configService: ConfigService,
  ) {}

  getTypeORMBasePath(): string {
    return join(__dirname, '..', '..', 'database');
  }

  getTypeORMPathEntities(): string {
    return join(this.getTypeORMBasePath(), 'entities');
  }

  getTypeORMPathMigrations(): string {
    return join(this.getTypeORMBasePath(), 'migrations');
  }

  getTypeORMPathSeeds(): string {
    return join(this.getTypeORMBasePath(), 'seeds');
  }

  getTypeORMPathSubscribers(): string {
    return join(this.getTypeORMBasePath(), 'subscribers');
  }

  // ...

  getTypeORMDBDatabase(): string | undefined {
    return this.configService.get<string>('DB_DATABASE');
  }

  getTypeORMDBHost(): string | undefined {
    return this.configService.get<string>('DB_HOST');
  }

  getTypeORMDBPassword(): string | undefined {
    return this.configService.get<string>('DB_PASSWORD');
  }

  getTypeORMDBPort(): string | undefined {
    return this.configService.get<string>('DB_PORT');
  }

  getTypeORMDBSchema(): string | undefined {
    return this.configService.get<string>('DB_SCHEMA');
  }

  getTypeORMDBUsername(): string | undefined {
    return this.configService.get<string>('DB_USERNAME');
  }

  getTypeORMDBConnection(): string | undefined {
    return this.configService.get<string>('DB_CONNECTION');
  }

  getTypeORMDBUrl(): string | undefined {
    return this.configService.get<string>('DATABASE_URL');
  }

  getTypeORMDBUseSSL(): string | undefined {
    return this.configService.get<string>('DATABASE_USE_SSL');
  }

  getTypeORMLogging(): string | undefined {
    return this.configService.get<string>('TYPEORM_LOGGING');
  }

  getTypeORMSharedDataSourceOptions(): Partial<DataSourceOptions> {
    const sharedEnvConfig = {};

    const DB_CONNECTION = this.getTypeORMDBConnection();

    if (DB_CONNECTION !== undefined) {
      const DB_HOST = this.getTypeORMDBHost();
      const DB_PORT = this.getTypeORMDBPort();
      const DB_USERNAME = this.getTypeORMDBUsername();
      const DB_PASSWORD = this.getTypeORMDBPassword();
      const DB_DATABASE = this.getTypeORMDBDatabase();
      const DB_SCHEMA = this.getTypeORMDBSchema();

      const TYPEORM_LOGGING = this.getTypeORMLogging();

      const DATABASE_URL = this.getTypeORMDBUrl();
      const DATABASE_USE_SSL = this.getTypeORMDBUseSSL();

      Object.assign(sharedEnvConfig, {
        type: DB_CONNECTION,

        host: DB_HOST,
        port: DB_PORT && parseInt(DB_PORT),

        username: DB_USERNAME,
        password: DB_PASSWORD,
        database: DB_DATABASE,
        schema: DB_SCHEMA,

        synchronize: false,

        logging: TYPEORM_LOGGING,
      } as Partial<DataSourceOptions>);

      if (DATABASE_URL) {
        Object.assign(sharedEnvConfig, {
          url: DATABASE_URL,
        });
      }

      if (DATABASE_USE_SSL !== 'false') {
        Object.assign(sharedEnvConfig, {
          options: {
            validateConnection: false,
            trustServerCertificate: true,
          },

          extra: {
            ssl: {
              rejectUnauthorized: false,
            },
          },
        });
      }
    }

    return {
      ...sharedEnvConfig,
    };
  }

  getTypeORMAppDataSourceOptions(): DataSourceOptions {
    const options = {
      ...this.getTypeORMSharedDataSourceOptions(),
      entities: [`${this.getTypeORMPathEntities()}/**/*{.ts,.js}`],
      subscribers: [`${this.getTypeORMPathSubscribers()}/**/*{.ts,.js}`],
    };

    return options as DataSourceOptions;
  }

  getTypeORMMigrationDataSourceOptions(): DataSourceOptions {
    const options = {
      ...this.getTypeORMSharedDataSourceOptions(),
      migrations: [`${this.getTypeORMPathMigrations()}/**/*{.ts,.js}`],
      migrationsTableName: 'app_migration_db',
    };

    return options as DataSourceOptions;
  }

  getTypeORMSeedDataSourceOptions(): DataSourceOptions {
    const options = {
      ...this.getTypeORMSharedDataSourceOptions(),
      entities: [`${this.getTypeORMPathEntities()}/**/*{.ts,.js}`],
      migrations: [`${this.getTypeORMPathSeeds()}/**/*{.ts,.js}`],
      migrationsTableName: 'app_migration_seed',
    };

    return options as DataSourceOptions;
  }
}
