import { InternalServerErrorException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AuthenticatedEntityType } from '../../../domain/authentication';
import { Actor } from './Actor';
import { ActorUser } from './ActorUser';
import { IActorContextDatabaseRunCallback, IActorContextDatabaseRunContext } from './interfaces';

export class ActorContext {
  constructor(
    // ...
    public readonly dataSource: DataSource,
    public readonly actor: Actor,
  ) {}

  // ...

  static forSystem(dataSource: DataSource) {
    return new ActorContext(dataSource, Actor.forInternalSystem());
  }

  static forUser(dataSource: DataSource, userId: string) {
    return new ActorContext(dataSource, ActorUser.forUser(userId));
  }

  // ...

  async databaseRun<T>(callback: IActorContextDatabaseRunCallback<T>): Promise<T> {
    const { dataSource, actor } = this;

    try {
      const result = await dataSource.transaction(async (entityManager) => {
        const queryRunner = entityManager.queryRunner;

        if (!queryRunner) {
          throw new InternalServerErrorException('Query runner not found.');
        }

        switch (actor.type) {
          case AuthenticatedEntityType.INTERNAL_SYSTEM: {
            break;
          }

          case AuthenticatedEntityType.USER: {
            const user = (<ActorUser>actor).userRef;

            if (user) {
              await queryRunner.query(`set local "request.auth.user.id" to ${user.id};`);
            }

            break;
          }

          case AuthenticatedEntityType.ANONONYMOUS:
          default: {
            break;
          }
        }

        const context: IActorContextDatabaseRunContext = { entityManager, queryRunner };

        return callback(context);
      });

      return result;
    } catch (error) {
      throw error;
    }
  }
}
