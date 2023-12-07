import { Module } from '@nestjs/common';
import { UsuarioResolver } from '../../adapters/graphql/usuario.resolver';
import { UsuarioService } from './usuario.service';
import { KCClientModule } from '../../../infrastructure/kc-client';

@Module({
  imports: [
    // ...
    KCClientModule,
  ],
  exports: [
    // ...
    UsuarioService,
  ],
  providers: [
    // ...
    UsuarioService,
    UsuarioResolver,
  ],
})
export class UsuarioModule {}
