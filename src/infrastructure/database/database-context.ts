import { DataSource, EntityManager } from 'typeorm';
import { getDBEventRepository } from './repositories/db_event.repository';

export class DatabaseContext {
  constructor(readonly ds: DataSource | EntityManager) {}


  get dbEventRepository() {
    return getDBEventRepository(this.ds);
  }
}
