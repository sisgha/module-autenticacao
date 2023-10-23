import { EntityManager, QueryRunner } from 'typeorm';

export type IActorContextDatabaseRunContext = {
  queryRunner: QueryRunner;
  entityManager: EntityManager;
};
