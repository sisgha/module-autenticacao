import { Module } from '@nestjs/common';
import { AutenticacaoUsuarioResolver } from './adapters/graphql/autenticacao-usuario.resolver';
import { AutenticacaoUsuarioService } from './autenticacao-usuario.service';
import { KeycloakClientModule } from '../../../infrastructure/keycloak-client';

@Module({
  imports: [
    // ...
    KeycloakClientModule,
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
