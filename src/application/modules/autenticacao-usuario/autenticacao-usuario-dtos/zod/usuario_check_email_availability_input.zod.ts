import { z } from 'zod';
import { UsuarioFindByIdInputZod } from './usuario_find_by_id_input.zod';
import { UsuarioCreateInputZod } from './usuario_create_input.zod';

export const UsuarioCheckEmailAvailabilityInputZod = z.object({
  usuarioId: UsuarioFindByIdInputZod.shape.id.nullable().default(null),
  email: UsuarioCreateInputZod.shape.email,
});
