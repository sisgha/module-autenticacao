import { Inject } from '@nestjs/common';
import { Mutation, Parent, Query, ResolveField, Resolver, ResolveReference } from '@nestjs/graphql';
import { ActorContext } from '../../../../../infrastructure/iam/actor-context';
import { ACTOR_CONTEXT_SYSTEM } from '../../../../../infrastructure/iam/actor-context/providers/actor-context-system.provider';
import { ResolveActorContext } from '../../../../../infrastructure/iam/authentication/decorators/ResolveActorContext';
import { ValidatedArgs } from '../../../../../infrastructure/zod/decorators';
import { AutenticacaoUsuarioService } from '../../autenticacao-usuario.service';
import {
  UpdateUsuarioInputZod,
  UsuarioCheckEmailAvailabilityInputZod,
  UsuarioCheckMatriculaSiapeAvailabilityInputZod,
  UsuarioCreateInputZod,
  UsuarioDeleteInputZod,
  UsuarioFindByIdInputZod,
  UsuarioUpdatePasswordInputZod,
} from '../../validation';
import {
  AutenticacaoUsuarioType,
  UsuarioCheckEmailAvailabilityInputType,
  UsuarioCheckMatriculaSiapeAvailabilityInputType,
  UsuarioCreateInputType,
  UsuarioDeleteInputType,
  UsuarioFindByIdInputType,
  UsuarioUpdateInputType,
} from './index';
import { UsuarioUpdatePasswordInputType } from './input-types/UsuarioUpdatePasswordInputType';

@Resolver(() => AutenticacaoUsuarioType)
export class AutenticacaoUsuarioResolver {
  constructor(
    // ...
    private usuarioService: AutenticacaoUsuarioService,
    @Inject(ACTOR_CONTEXT_SYSTEM)
    private actorContextSystem: ActorContext,
  ) {}

  @ResolveReference()
  async resolveReference(reference: { __typename: string; id: string }): Promise<AutenticacaoUsuarioType> {
    return this.usuarioService.usuarioFindByIdStrictSimple(this.actorContextSystem, reference.id);
  }

  // START: queries

  @Query(() => AutenticacaoUsuarioType)
  async usuarioFindById(
    @ResolveActorContext()
    actorContext: ActorContext,
    @ValidatedArgs('dto', UsuarioFindByIdInputZod)
    dto: UsuarioFindByIdInputType,
  ) {
    return this.usuarioService.usuarioFindByIdStrict(actorContext, dto);
  }

  //

  @Query(() => Boolean)
  async usuarioCheckEmailAvailability(
    @ResolveActorContext()
    actorContext: ActorContext,
    @ValidatedArgs('dto', UsuarioCheckEmailAvailabilityInputZod)
    dto: UsuarioCheckEmailAvailabilityInputType,
  ) {
    return this.usuarioService.usuarioCheckEmailAvailability(actorContext, dto);
  }

  @Query(() => Boolean)
  async usuarioCheckMatriculaSiapeAvailability(
    @ResolveActorContext()
    actorContext: ActorContext,
    @ValidatedArgs('dto', UsuarioCheckMatriculaSiapeAvailabilityInputZod)
    dto: UsuarioCheckMatriculaSiapeAvailabilityInputType,
  ) {
    return this.usuarioService.usuarioCheckMatriculaSiapeAvailability(actorContext, dto);
  }

  // END: queries

  // START: mutations

  @Mutation(() => AutenticacaoUsuarioType)
  async usuarioCreate(
    @ResolveActorContext()
    actorContext: ActorContext,
    @ValidatedArgs('dto', UsuarioCreateInputZod)
    dto: UsuarioCreateInputType,
  ) {
    return this.usuarioService.usuarioCreate(actorContext, dto);
  }

  @Mutation(() => AutenticacaoUsuarioType)
  async usuarioUpdate(
    @ResolveActorContext()
    actorContext: ActorContext,
    @ValidatedArgs('dto', UpdateUsuarioInputZod)
    dto: UsuarioUpdateInputType,
  ) {
    return this.usuarioService.usuarioUpdate(actorContext, dto);
  }

  @Mutation(() => Boolean)
  async usuarioUpdatePassword(
    @ResolveActorContext()
    actorContext: ActorContext,
    @ValidatedArgs('dto', UsuarioUpdatePasswordInputZod)
    dto: UsuarioUpdatePasswordInputType,
  ) {
    return this.usuarioService.usuarioUpdatePassword(actorContext, dto);
  }

  @Mutation(() => Boolean)
  async usuarioDelete(
    @ResolveActorContext()
    actorContext: ActorContext,
    @ValidatedArgs('dto', UsuarioDeleteInputZod)
    dto: UsuarioDeleteInputType,
  ) {
    return this.usuarioService.usuarioDelete(actorContext, dto);
  }

  // END: mutations

  // START: fields graphql-resolvers

  @ResolveField('nome', () => String, { nullable: true })
  async nome(
    @ResolveActorContext()
    actorContext: ActorContext,
    @Parent()
    parent: AutenticacaoUsuarioType,
  ) {
    return this.usuarioService.getUsuarioNome(actorContext, parent.id);
  }

  @ResolveField('email', () => String, { nullable: true })
  async email(
    @ResolveActorContext()
    actorContext: ActorContext,
    @Parent()
    parent: AutenticacaoUsuarioType,
  ) {
    return this.usuarioService.getUsuarioEmail(actorContext, parent.id);
  }

  @ResolveField('matriculaSiape', () => String, { nullable: true })
  async matriculaSiape(
    @ResolveActorContext()
    actorContext: ActorContext,
    @Parent()
    parent: AutenticacaoUsuarioType,
  ) {
    return this.usuarioService.getUsuarioMatriculaSiape(actorContext, parent.id);
  }

  //

  // ...

  @ResolveField('dateCreated', () => Date)
  async dateCreated(
    @ResolveActorContext()
    actorContext: ActorContext,
    @Parent()
    parent: AutenticacaoUsuarioType,
  ) {
    return this.usuarioService.getUsuarioDateCreated(actorContext, parent.id);
  }

  @ResolveField('dateUpdated', () => Date)
  async dateUpdated(
    @ResolveActorContext()
    actorContext: ActorContext,
    @Parent()
    parent: AutenticacaoUsuarioType,
  ) {
    return this.usuarioService.getUsuarioDateUpdated(actorContext, parent.id);
  }

  @ResolveField('dateDeleted', () => Date, { nullable: true })
  async dateDeleted(
    @ResolveActorContext()
    actorContext: ActorContext,
    @Parent()
    parent: AutenticacaoUsuarioType,
  ) {
    return this.usuarioService.getUsuarioDateDeleted(actorContext, parent.id);
  }

  // END: fields graphql-resolvers
}
