import { IModuleAutenticacaoAppResource } from '../../domain';
import { AutenticacaoUsuarioAppResource } from './autenticacao-usuario/autenticacao-usuario.app-resource';

export const AutenticacaoAppResources: IModuleAutenticacaoAppResource[] = [
  //
  AutenticacaoUsuarioAppResource,
];

export const getAppResourceByKey = (key: string) => {
  return AutenticacaoAppResources.find((i) => i.key === key) ?? null;
};

export const getAppResourceTableName = (key: string) => {
  const appResource = getAppResourceByKey(key);
  return appResource?.tableName ?? null;
};

export const getAppResourceByTableName = (tableName: string) => {
  return AutenticacaoAppResources.find((i) => i.tableName === tableName) ?? null;
};

export const getAppResourceKeyByTableName = (tableName: string) => {
  const appResource = getAppResourceByTableName(tableName);
  return appResource?.key ?? null;
};
