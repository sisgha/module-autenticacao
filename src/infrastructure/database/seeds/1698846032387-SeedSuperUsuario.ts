import { NestFactory } from '@nestjs/core';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { ACTOR_CONTEXT_SYSTEM } from '../../iam/actor-context/providers/actor-context-system.provider';
import { AppModule } from '../../../application/app.module';
import { EnvironmentConfigService } from '../../environment-config';
import { KeycloakClientService } from '../../keycloak-client';
import { DatabaseContext } from '../database-context';
import { UsuarioDbEntity } from '../entities/usuario.db.entity';

const NOME_SUPER_USUARIO = 'Super Usuário';

export class SeedSuperUsuario1698846032387 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const dataSource = queryRunner.connection;

    //

    const app = await NestFactory.create(AppModule);

    const { usuarioRepository } = DatabaseContext.new(dataSource);

    const superUsuarioAlreadyCreated = await usuarioRepository
      .count({
        where: {
          flagSeedSuperUsuario: true,
        },
      })
      .then((count) => count > 0);

    const shouldCreateSuperUsuario = !superUsuarioAlreadyCreated;

    if (shouldCreateSuperUsuario) {
      console.log('[db seeds] [seed super usuario] : creating super usuario because no one exists.');

      const actorContextSystem = app.get(ACTOR_CONTEXT_SYSTEM);

      const env = app.get(EnvironmentConfigService);
      const credentials = env.getSeedSuperUsuarioCredentials();

      const kcClientService = app.get(KeycloakClientService);

      const kcUser = await kcClientService.createUser(actorContextSystem, {
        email: credentials.email,
        matriculaSiape: credentials.matriculaSiape,
        nome: NOME_SUPER_USUARIO,
      });

      const usuario = <UsuarioDbEntity>{
        id: kcUser.id,
        nome: NOME_SUPER_USUARIO,
        email: credentials.email,
        matriculaSiape: credentials.matriculaSiape,
        flagSeedSuperUsuario: true,
      };

      await usuarioRepository.save(usuario);

      await kcClientService.updateUserPassword(
        actorContextSystem,
        kcUser.id,
        {
          currentPassword: '',
          confirmNewPassword: credentials.password,
          newPassword: credentials.password,
        },
        false,
      );
    } else {
      console.log('[db seeds] [seed super usuario] : skipping seed super usuario because other one already exists.');
    }

    await app.close();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const dataSource = queryRunner.connection;

    //

    const app = await NestFactory.create(AppModule);

    //

    const { usuarioRepository } = DatabaseContext.new(dataSource);

    const superUsuarios = await usuarioRepository.find({ where: { flagSeedSuperUsuario: true }, select: ['id'] });

    for (const usuario of superUsuarios) {
      await usuarioRepository.delete(usuario.id);

      const actorContextSystem = app.get(ACTOR_CONTEXT_SYSTEM);
      const kcClientService = app.get(KeycloakClientService);

      await kcClientService.deleteUser(actorContextSystem, usuario.id);
    }

    await app.close();
  }
}
