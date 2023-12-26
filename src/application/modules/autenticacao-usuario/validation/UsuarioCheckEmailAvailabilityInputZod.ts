import { z } from 'zod';
import { UsuarioFindByIdInputZod } from './UsuarioFindByIdInputZod';
import { UsuarioCreateInputZod } from './UsuarioCreateInputZod';

export const UsuarioCheckEmailAvailabilityInputZod = z.object({
  usuarioId: UsuarioFindByIdInputZod.shape.id.nullable().default(null),
  email: UsuarioCreateInputZod.shape.email,
});
