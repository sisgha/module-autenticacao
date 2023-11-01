import { DataSource, EntityManager } from 'typeorm';
import { getDBEventRepository } from './repositories/db_event.repository';
import { getUsuarioRepository } from './repositories/usuario.repository';

export class DatabaseContext {
  constructor(readonly ds: DataSource | EntityManager) {}

  get usuarioRepository() {
    return getUsuarioRepository(this.ds);
  }

  get dbEventRepository() {
    return getDBEventRepository(this.ds);
  }
}
