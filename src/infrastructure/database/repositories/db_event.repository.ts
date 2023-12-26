import { DataSource, EntityManager } from 'typeorm';
import { DbEventDbEntity } from '../entities/db_event.db.entity';

export type IDBEventRepository = ReturnType<typeof getDBEventRepository>;

export const getDBEventRepository = (dataSource: DataSource | EntityManager) => dataSource.getRepository(DbEventDbEntity).extend({});
