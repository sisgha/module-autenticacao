import { Module } from '@nestjs/common';
import { KCClientModule } from '../../../kc-client/kc-client.module';
import { UsuarioResolver } from '../../adapters/graphql/usuario.resolver';
import { UsuarioService } from './usuario.service';

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
