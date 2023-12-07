import { z } from 'zod';
import { UUIDZod } from '../../_literals/uuid.zod';

export const UsuarioFindByIdInputZod = z.object({
  id: UUIDZod,
});
