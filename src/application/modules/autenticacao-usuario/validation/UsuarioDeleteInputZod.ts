import {UsuarioFindByIdInputZod} from './UsuarioFindByIdInputZod';

export const UsuarioDeleteInputZod = UsuarioFindByIdInputZod.pick({
  id: true,
});
