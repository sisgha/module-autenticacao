import { z } from 'zod';

export const UsuarioCreateInputZod = z.object({
  nome: z.string().trim().min(1),
  email: z.string().email(),
  matriculaSiape: z.string().trim(),
});
