import {z} from 'zod';
import {UsuarioFindByIdInputZod} from './UsuarioFindByIdInputZod';
import {UsuarioCreateInputZod} from './UsuarioCreateInputZod';

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
