import { IUsuarioInternoFindByIdInput } from './IUsuarioInternoFindByIdInput';

export type IUsuarioInternoUpdateInput = {
  id: IUsuarioInternoFindByIdInput['id'];
  tipoEntidade?: string;
};
