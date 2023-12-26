import { z } from 'zod';
import { UsuarioFindByIdInputZod } from './UsuarioFindByIdInputZod';
import { UsuarioCreateInputZod } from './UsuarioCreateInputZod';

export const UsuarioCheckMatriculaSiapeAvailabilityInputZod = z.object({
  usuarioId: UsuarioFindByIdInputZod.shape.id.nullable().default(null),
  matriculaSiape: UsuarioCreateInputZod.shape.matriculaSiape,
});
