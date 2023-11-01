import { InternalServerErrorException } from '@nestjs/common';
import { IRequestUser } from '@sisgea/nest-sso';
import { DataSource } from 'typeorm';
import { AuthenticatedEntityType } from '../../../domain/authentication';
import { Actor, ActorUser } from '../../authentication';
import { DatabaseContext } from '../../database/database-context';

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

  static forRequestUser(dataSource: DataSource, requestUser: IRequestUser | null) {
    const actor = ActorUser.forRequestUser(requestUser);
    return new ActorContext(dataSource, actor);
  }

  // ...

  async db_run<T>(callback: (payload: DatabaseContext) => Promise<T>): Promise<T> {
    const { dataSource, actor } = this;

    try {
      const result = await dataSource.transaction(async (entityManager) => {
        const queryRunner = entityManager.queryRunner;

        if (!queryRunner) {
          throw new InternalServerErrorException();
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

        return callback(new DatabaseContext(entityManager));
      });

      return result;
    } catch (error) {
      throw error;
    }
  }

  //

  async can() {
    // TODO: module-autorizacao
    return true;
  }

  async readResource(resource: string, data: any) {
    // TODO: module-autorizacao
    return data;
  }

  async ensurePermission(resource: string, action: string, data: any) {
    // TODO: module-autorizacao
    return true;
  }
}
