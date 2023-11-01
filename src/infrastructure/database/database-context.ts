import { DataSource, EntityManager } from 'typeorm';

export class DatabaseContext {
  constructor(readonly ds: DataSource | EntityManager) {}

}
