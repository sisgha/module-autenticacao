import { IActorContextDatabaseRunContext } from './IActorContextDatabaseRunContext';

export type IActorContextDatabaseRunCallback<T> = (payload: IActorContextDatabaseRunContext) => Promise<T>;
