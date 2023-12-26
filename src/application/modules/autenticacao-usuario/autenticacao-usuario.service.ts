import {ForbiddenException, Injectable, InternalServerErrorException, NotFoundException} from '@nestjs/common';
import {
  IUsuarioCheckEmailAvailabilityInput,
  IUsuarioCheckMatriculaSiapeAvailabilityInput,
  IUsuarioCreateInput,
  IUsuarioDeleteInput,
  IUsuarioFindByIdInput,
  IUsuarioUpdateInput,
  IUsuarioUpdatePasswordInput,
  SisgeaResource,
  ValidationErrorCodesAuth,
  ValidationErrorCodeUsuario,
} from '@sisgea/spec';
import {get, has, omit, pick} from 'lodash';
import {FindOneOptions} from 'typeorm';
import {ValidationFailedException} from '../../../infrastructure/api-app/validation';
import {UsuarioDbEntity} from '../../../infrastructure/database/entities/usuario.db.entity';
import {ActorContext} from '../../../infrastructure/iam/actor-context';
import {ActorUser} from '../../../infrastructure/iam/authentication';
import {IAuthorizationAction} from '../../../infrastructure/iam/authorization';
import {KeycloakClientService} from '../../../infrastructure/keycloak-client';

@Injectable()
export class AutenticacaoUsuarioService {
  constructor(
    // ...
    private keycloakClientService: KeycloakClientService,
  ) {
  }

  async usuarioFindById(actorContext: ActorContext, dto: IUsuarioFindByIdInput, options?: FindOneOptions<UsuarioDbEntity>) {
    const targetUsuario = await actorContext.db_run(async ({usuarioRepository}) => {
      return usuarioRepository.findOne({
        cache: 50,
        ...options,
        where: {id: dto.id, ...options?.where},
        select: ['id'],
      });
    });

    if (!targetUsuario) {
      return null;
    }

    const usuario = await actorContext.db_run<UsuarioDbEntity>(async ({usuarioRepository}) => {
      return await usuarioRepository.findOneOrFail({
        select: ['id'],
        ...options,
        where: {id: targetUsuario.id},
      });
    });

    return actorContext.readResource(SisgeaResource.USUARIO, usuario);
  }

  async usuarioFindByIdSimple<T = Pick<UsuarioDbEntity, 'id'>>(
    actorContext: ActorContext,
    usuarioId: IUsuarioFindByIdInput['id'],
  ): Promise<T | null> {
    const usuario = await this.usuarioFindById(actorContext, {id: usuarioId});
    return <T>usuario;
  }

  async usuarioFindByIdStrict(actorContext: ActorContext, dto: IUsuarioFindByIdInput, options?: FindOneOptions<UsuarioDbEntity>) {
    const usuario = await this.usuarioFindById(actorContext, dto, options);

    if (!usuario) {
      throw new NotFoundException();
    }

    return usuario;
  }

  async usuarioFindByIdStrictSimple<T = Pick<UsuarioDbEntity, 'id'>>(
    actorContext: ActorContext,
    usuarioId: IUsuarioFindByIdInput['id'],
  ): Promise<T> {
    const usuario = await this.usuarioFindByIdStrict(actorContext, {id: usuarioId});
    return <T>usuario;
  }

  async usuarioFindByEmail(actorContext: ActorContext, email: string, options?: FindOneOptions<UsuarioDbEntity>) {
    const targetUsuario = await actorContext.db_run(async ({usuarioRepository}) => {
      return await usuarioRepository.findOne({
        where: {email: email},
        select: ['id'],
      });
    });

    if (!targetUsuario) {
      return null;
    }

    return this.usuarioFindById(actorContext, {id: targetUsuario.id}, options);
  }

  async usuarioFindByEmailStrict(actorContext: ActorContext, email: string, options?: FindOneOptions<UsuarioDbEntity>) {
    const usuario = await this.usuarioFindByEmail(actorContext, email, options);

    if (!usuario) {
      throw new NotFoundException();
    }

    return usuario;
  }

  async usuarioFindByMatriculaSiape(actorContext: ActorContext, matriculaSiape: string, options?: FindOneOptions<UsuarioDbEntity>) {
    const targetUsuario = await actorContext.db_run(async ({usuarioRepository}) => {
      return await usuarioRepository.findOne({
        where: {matriculaSiape: matriculaSiape},
        select: ['id'],
      });
    });

    if (!targetUsuario) {
      return null;
    }

    return this.usuarioFindById(actorContext, {id: targetUsuario.id}, options);
  }

  async usuarioFindByMatriculaSiapeStrict(actorContext: ActorContext, matriculaSiape: string, options?: FindOneOptions<UsuarioDbEntity>) {
    const usuario = await this.usuarioFindByEmail(actorContext, matriculaSiape, options);

    if (!usuario) {
      throw new NotFoundException();
    }

    return usuario;
  }

  async usuarioCheckEmailAvailability(actorContext: ActorContext, dto: IUsuarioCheckEmailAvailabilityInput) {
    const isEmailBeingUsedByOtherUsuario = await actorContext.db_run(async ({usuarioRepository}) => {
      const qb = usuarioRepository.createQueryBuilder('usuario');

      qb.select('usuario.id');

      qb.where('usuario.email = :email', {email: dto.email});

      qb.andWhere('usuario.dateDeleted is NULL');

      if (dto.usuarioId) {
        qb.andWhere('usuario.id != :usuarioId', {usuarioId: dto.usuarioId});
      }

      const count = await qb.getCount();

      return count === 0;
    });

    return isEmailBeingUsedByOtherUsuario;
  }

  async usuarioCheckMatriculaSiapeAvailability(actorContext: ActorContext, dto: IUsuarioCheckMatriculaSiapeAvailabilityInput) {
    const isMatriculaSiapeBeingUsedByOtherUsuario = await actorContext.db_run(async ({usuarioRepository}) => {
      const qb = usuarioRepository.createQueryBuilder('usuario');

      qb.select('usuario.id');

      qb.where('usuario.matriculaSiape = :matriculaSiape', {matriculaSiape: dto.matriculaSiape});

      qb.andWhere('usuario.dateDeleted is NULL');

      if (dto.usuarioId) {
        qb.andWhere('usuario.id != :usuarioId', {usuarioId: dto.usuarioId});
      }

      const count = await qb.getCount();

      return count === 0;
    });

    return isMatriculaSiapeBeingUsedByOtherUsuario;
  }

  async getUsuariosCount(actorContext: ActorContext, includeDeleted = false) {
    return actorContext.db_run(async ({usuarioRepository}) => {
      const qb = usuarioRepository.createQueryBuilder('usuario');

      qb.select('usuario.id');

      if (!includeDeleted) {
        qb.where('usuario.dateDeleted IS NULL');
      }

      const usersCount = await qb.getCount();

      return usersCount;
    });
  }

  async getHasUsuarios(actorContext: ActorContext, includeDeleted = false) {
    const usersCount = await this.getUsuariosCount(actorContext, includeDeleted);
    return usersCount > 0;
  }

  //

  async getUsuarioStrictGenericField<K extends keyof UsuarioDbEntity>(
    actorContext: ActorContext,
    usuarioId: IUsuarioFindByIdInput['id'],
    field: K,
  ): Promise<UsuarioDbEntity[K]> {
    const usuario = await this.usuarioFindByIdStrict(
      actorContext,
      {
        id: usuarioId,
      },
      {
        select: ['id', field],
      },
    );

    await actorContext.ensurePermission(SisgeaResource.USUARIO, IAuthorizationAction.READ, usuario, [field]);

    return <UsuarioDbEntity[K]>usuario[field];
  }

  // ...

  async getUsuarioNome(actorContext: ActorContext, usuarioId: IUsuarioFindByIdInput['id']) {
    return this.getUsuarioStrictGenericField(actorContext, usuarioId, 'nome');
  }

  async getUsuarioEmail(actorContext: ActorContext, usuarioId: IUsuarioFindByIdInput['id']) {
    return this.getUsuarioStrictGenericField(actorContext, usuarioId, 'email');
  }

  async getUsuarioMatriculaSiape(actorContext: ActorContext, usuarioId: IUsuarioFindByIdInput['id']) {
    return this.getUsuarioStrictGenericField(actorContext, usuarioId, 'matriculaSiape');
  }

  //

  async getUsuarioDateCreated(actorContext: ActorContext, usuarioId: IUsuarioFindByIdInput['id']) {
    return this.getUsuarioStrictGenericField(actorContext, usuarioId, 'dateCreated');
  }

  async getUsuarioDateUpdated(actorContext: ActorContext, usuarioId: IUsuarioFindByIdInput['id']) {
    return this.getUsuarioStrictGenericField(actorContext, usuarioId, 'dateUpdated');
  }

  async getUsuarioDateDeleted(actorContext: ActorContext, usuarioId: IUsuarioFindByIdInput['id']) {
    return this.getUsuarioStrictGenericField(actorContext, usuarioId, 'dateDeleted');
  }

  // ...

  async loadUsuarioFromId(actorContext: ActorContext, usuarioId: string) {
    const dbUsuario = await this.usuarioFindById(actorContext, {id: usuarioId});

    if (dbUsuario) {
      const dbUsuarioDateDeleted = await this.getUsuarioDateDeleted(actorContext, dbUsuario.id);

      if (dbUsuarioDateDeleted === null) {
        return {
          id: dbUsuario.id,
        };
      } else {
        throw new ForbiddenException('The provided usuario is inactive.');
      }
    } else {
      const ssoUser = await this.keycloakClientService.findUserByKeycloakIdStrict(actorContext, usuarioId);

      const ssoUserId = ssoUser.id ?? null;

      if (ssoUserId === null) {
        throw new InternalServerErrorException('The provided user was not found on the KeyCloak repository.');
      }

      const matriculaSiapeFromSSO = ssoUser.username;

      if (matriculaSiapeFromSSO) {
        const dbUsuarioByKeycloakUsername = await this.usuarioFindByMatriculaSiape(actorContext, matriculaSiapeFromSSO, {});

        if (dbUsuarioByKeycloakUsername) {
          throw new InternalServerErrorException(
            'The authed SSO user has a MatriculaSiape already in use by other usuario in this microservice.',
          );
        }
      }

      const newUsuario = await actorContext.db_run(async ({usuarioRepository}) => {
        const newUsuario = usuarioRepository.create();

        newUsuario.id = usuarioId;
        newUsuario.nome = KeycloakClientService.buildUserFullName(ssoUser);
        newUsuario.email = ssoUser.email ?? null;
        newUsuario.matriculaSiape = ssoUser.username ?? null;

        await usuarioRepository.save(newUsuario);

        return newUsuario;
      });

      return {
        id: newUsuario.id,
      };
    }
  }

  async usuarioCreate(actorContext: ActorContext, dto: IUsuarioCreateInput) {
    const fieldsData = pick(dto, ['email', 'nome', 'matriculaSiape']);

    if (has(fieldsData, 'email')) {
      const email = get(fieldsData, 'email')!;

      const isEmailAvailable = await this.usuarioCheckEmailAvailability(actorContext, {email: email, usuarioId: null});

      if (!isEmailAvailable) {
        throw new ValidationFailedException([
          {
            code: ValidationErrorCodeUsuario.USUARIO_EMAIL_ALREADY_IN_USE,
            message: 'Já existe um usuário com o mesmo email.',
            path: ['email'],
          },
        ]);
      }
    }

    if (has(fieldsData, 'matriculaSiape')) {
      const matriculaSiape = get(fieldsData, 'matriculaSiape')!;

      const isMatriculaSiapeAvailable = await this.usuarioCheckMatriculaSiapeAvailability(actorContext, {
        matriculaSiape: matriculaSiape,
        usuarioId: null,
      });

      if (!isMatriculaSiapeAvailable) {
        throw new ValidationFailedException([
          {
            code: ValidationErrorCodeUsuario.USUARIO_MATRICULA_SIAPE_ALREADY_IN_USE,
            message: 'Já existe um usuário com a mesma Matrícula Siape.',
            path: ['matriculaSiape'],
          },
        ]);
      }
    }

    const usuario = <UsuarioDbEntity>{
      ...fieldsData,
    };

    await actorContext.ensurePermission(SisgeaResource.USUARIO, IAuthorizationAction.CREATE, usuario);

    const dbUsuario = await actorContext.db_run(async ({usuarioRepository}) => {
      const kcUsuario = await this.keycloakClientService.createUser(actorContext, {...dto});

      usuario.id = kcUsuario.id;

      await usuarioRepository.save(usuario);

      return <UsuarioDbEntity>usuario;
    });

    return this.usuarioFindByIdStrictSimple(actorContext, dbUsuario.id);
  }

  async usuarioUpdate(actorContext: ActorContext, dto: IUsuarioUpdateInput) {
    const usuario = await this.usuarioFindByIdStrictSimple(actorContext, dto.id);

    const fieldsData = omit(dto, ['id']);

    if (has(fieldsData, 'email')) {
      const email = get(fieldsData, 'email')!;

      const isEmailAvailable = await this.usuarioCheckEmailAvailability(actorContext, {
        email: email,
        usuarioId: usuario.id,
      });

      if (!isEmailAvailable) {
        throw new ValidationFailedException([
          {
            code: ValidationErrorCodeUsuario.USUARIO_EMAIL_ALREADY_IN_USE,
            message: 'Já existe um usuário com o mesmo email.',
            path: ['email'],
          },
        ]);
      }
    }

    if (has(fieldsData, 'matriculaSiape')) {
      const matriculaSiape = get(fieldsData, 'matriculaSiape')!;

      const isMatriculaSiapeAvailable = await this.usuarioCheckMatriculaSiapeAvailability(actorContext, {
        matriculaSiape: matriculaSiape,
        usuarioId: usuario.id,
      });

      if (!isMatriculaSiapeAvailable) {
        throw new ValidationFailedException([
          {
            code: ValidationErrorCodeUsuario.USUARIO_MATRICULA_SIAPE_ALREADY_IN_USE,
            message: 'Já existe um usuário com a mesma Matrícula SIAPE.',
            path: ['matriculaSiape'],
          },
        ]);
      }
    }

    const updatedUsuario = {
      ...usuario,
      ...fieldsData,
    };

    await actorContext.ensurePermission(SisgeaResource.USUARIO, IAuthorizationAction.UPDATE, updatedUsuario);

    await actorContext.db_run(async ({usuarioRepository}) => {
      const result = await usuarioRepository
        .createQueryBuilder('user')
        .update()
        .set(updatedUsuario)
        .where('id = :id', {id: usuario.id})
        .execute();

      const rowsAffected = result.affected ?? 0;

      if (rowsAffected > 0) {
        await this.keycloakClientService.updateUser(actorContext, usuario.id, dto);
      }

      return result;
    });

    return this.usuarioFindByIdStrictSimple(actorContext, usuario.id);
  }

  async usuarioUpdatePassword(actorContext: ActorContext, dto: IUsuarioUpdatePasswordInput) {
    const usuario = await this.usuarioFindByIdStrictSimple(actorContext, dto.id);

    const invokeContextUserRef = actorContext.actor instanceof ActorUser && actorContext.actor.userRef;

    if (!invokeContextUserRef || invokeContextUserRef.id !== usuario.id) {
      throw new ForbiddenException("You can't change other user password.");
    }

    const isPasswordCorrect = await this.keycloakClientService.checkUserPassword(actorContext, usuario.id, dto.currentPassword);

    if (!isPasswordCorrect) {
      throw new ValidationFailedException([
        {
          code: ValidationErrorCodesAuth.AUTH_PASSWORD_INVALID,
          message: 'Senha atual inválida.',
          path: ['currentPassword'],
        },
      ]);
    }

    const updatedUsuario = await this.keycloakClientService.updateUserPassword(actorContext, usuario.id, dto, false);

    return updatedUsuario;
  }

  async usuarioDelete(actorContext: ActorContext, dto: IUsuarioDeleteInput) {
    const usuario = await this.usuarioFindByIdStrictSimple(actorContext, dto.id);

    await actorContext.ensurePermission(SisgeaResource.USUARIO, IAuthorizationAction.DELETE, usuario);

    const usuarioDateDeleted = await this.getUsuarioDateDeleted(actorContext, dto.id);

    if (usuarioDateDeleted === null) {
      await actorContext.db_run(async ({usuarioRepository}) => {
        const result = await usuarioRepository
          .createQueryBuilder('usuario')
          .update()
          .set({
            dateDeleted: new Date(),
          })
          .where('id = :id', {id: usuario.id})
          .execute();

        return result;
      });
    }

    return true;
  }
}
