import { z } from 'zod';
import { UsuarioFindByIdInputZod } from './usuario_find_by_id_input.zod';

export const UsuarioUpdatePasswordInputZod = z
  .object({})
  .merge(UsuarioFindByIdInputZod)
  .merge(
    z.object({
      currentPassword: z.string(),
      newPassword: z.string(),
      confirmNewPassword: z.string(),
    }),
  )
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords don't match",
    path: ['confirmNewPassword'],
  });
