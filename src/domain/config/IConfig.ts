import { IConfigTypeORM } from './IConfigTypeORM';
import { IConfigTypeORMDataSource } from './IConfigTypeORMDataSource';

export interface IConfig extends IConfigTypeORM, IConfigTypeORMDataSource {}
