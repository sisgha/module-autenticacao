import { ISISGEANestSSOConfig } from '@sisgea/nest-sso';
import { IConfigDatabase } from './IConfigDatabase';
import { IConfigMessageBroker } from './IConfigMessageBroker';
import { IConfigRuntime } from './IConfigRuntime';
import { IConfigTypeORM } from './IConfigTypeORM';
import { IConfigTypeORMDataSources } from './IConfigTypeORMDataSources';

export interface IConfig
  extends IConfigRuntime,
    IConfigDatabase,
    IConfigTypeORM,
    IConfigTypeORMDataSources,
    ISISGEANestSSOConfig,
    IConfigMessageBroker {}
