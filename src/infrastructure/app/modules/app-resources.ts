import { IAppResource } from '../../../domain/app/IAppResource';

export const APP_RESOURCES: IAppResource[] = [
  //
];

export const getAppResourceByKey = (key: string) => {
  return APP_RESOURCES.find((i) => i.key === key) ?? null;
};

export const getAppResourceTableName = (key: string) => {
  const appResource = getAppResourceByKey(key);
  return appResource?.tableName ?? null;
};

export const getAppResourceByTableName = (tableName: string) => {
  return APP_RESOURCES.find((i) => i.tableName === tableName) ?? null;
};

export const getAppResourceKeyByTableName = (tableName: string) => {
  const appResource = getAppResourceByTableName(tableName);
  return appResource?.key ?? null;
};
