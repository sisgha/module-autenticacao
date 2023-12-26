import { Module } from '@nestjs/common';
import { KeycloakAdminClientContainerModule, OidcClientContainerModule } from '@sisgea/nest-auth-connect';
import { KeycloakClientService } from './keycloak-client.service';

@Module({
  imports: [
    //
    KeycloakAdminClientContainerModule,
    OidcClientContainerModule,
  ],
  providers: [
    //
    KeycloakClientService,
  ],
  exports: [
    //
    KeycloakClientService,
  ],
})
export class KeycloakClientModule {}
