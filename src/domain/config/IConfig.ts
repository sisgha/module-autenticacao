import { ISISGEANestSSOConfig } from '@sisgea/nest-sso';
import { IConfigRuntime } from './IConfigRuntime';
import { IConfigTypeORM } from './IConfigTypeORM';
import { IConfigTypeORMDataSource } from './IConfigTypeORMDataSource';

export interface IConfig extends IConfigRuntime, IConfigTypeORM, IConfigTypeORMDataSource, ISISGEANestSSOConfig {}
