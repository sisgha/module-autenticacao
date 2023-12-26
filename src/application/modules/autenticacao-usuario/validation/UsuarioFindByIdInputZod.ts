import { z } from 'zod';
import { UUIDZod } from '../../../../infrastructure/zod/zod-literals/uuid.zod';

export const UsuarioFindByIdInputZod = z.object({
  id: UUIDZod,
});
