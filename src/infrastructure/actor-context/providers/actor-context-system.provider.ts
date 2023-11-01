import { Provider } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { ActorContext } from '../ActorContext/ActorContext';

export const ACTOR_CONTEXT_SYSTEM = Symbol();

export const actorContextSystemProvider: Provider = {
  provide: ACTOR_CONTEXT_SYSTEM,

  useFactory: async (
    //
    databaseService: DatabaseService,
  ) => {
    const dataSource = await databaseService.getAppDataSource();
    return ActorContext.forSystem(dataSource);
  },

  inject: [
    //
    DatabaseService,
  ],
};
