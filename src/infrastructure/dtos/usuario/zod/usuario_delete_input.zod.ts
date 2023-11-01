import { UsuarioFindByIdInputZod } from './usuario_find_by_id_input.zod';

export const UsuarioDeleteInputZod = UsuarioFindByIdInputZod.pick({
  id: true,
});
