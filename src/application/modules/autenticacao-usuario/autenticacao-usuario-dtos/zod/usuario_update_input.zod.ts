import { z } from 'zod';
import { UsuarioFindByIdInputZod } from './usuario_find_by_id_input.zod';
import { UsuarioCreateInputZod } from './usuario_create_input.zod';

export const UpdateUsuarioInputZod = z
  .object({})
  .merge(UsuarioFindByIdInputZod)
  .merge(
    UsuarioCreateInputZod.pick({
      nome: true,
      email: true,
      matriculaSiape: true,
    }).partial(),
  );
