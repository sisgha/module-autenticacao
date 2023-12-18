import { Module } from '@nestjs/common';
import { AutenticacaoUsuarioResolver } from './autenticacao-usuario.resolver';
import { AutenticacaoUsuarioService } from './autenticacao-usuario.service';
import { KCClientModule } from '../../../infrastructure/kc-client';

@Module({
  imports: [
    // ...
    KCClientModule,
  ],
  exports: [
    // ...
    AutenticacaoUsuarioService,
  ],
  providers: [
    // ...
    AutenticacaoUsuarioService,
    AutenticacaoUsuarioResolver,
  ],
})
export class AutenticacaoUsuarioModule {}
