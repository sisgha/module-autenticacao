import { Inject } from '@nestjs/common';
import { Mutation, Parent, Query, ResolveField, ResolveReference, Resolver } from '@nestjs/graphql';
import { ActorContext } from '../../../actor-context/ActorContext/ActorContext';
import { ACTOR_CONTEXT_SYSTEM } from '../../../actor-context/providers/actor-context-system.provider';
import {
  UpdateUsuarioInputZod,
  UsuarioCheckEmailAvailabilityInputZod,
  UsuarioCheckMatriculaSiapeAvailabilityInputZod,
  UsuarioCreateInputZod,
  UsuarioDeleteInputZod,
  UsuarioFindByIdInputZod,
  UsuarioUpdatePasswordInputZod,
} from '../../../dtos/usuario';
import {
  UsuarioCheckEmailAvailabilityInputType,
  UsuarioCheckMatriculaSiapeAvailabilityInputType,
  UsuarioCreateInputType,
  UsuarioDeleteInputType,
  UsuarioFindByIdInputType,
  UsuarioType,
  UsuarioUpdateInputType,
} from '../../../dtos/usuario/graphql';
import { UsuarioUpdatePasswordInputType } from '../../../dtos/usuario/graphql/usuario_update_password_input.type';
import { ValidatedArgs } from '../../../zod/decorators';
import { ResolveActorContext } from '../../decorators/ResolveActorContext';
import { UsuarioService } from '../../modules/usuario/usuario.service';

@Resolver(() => UsuarioType)
export class UsuarioResolver {
  constructor(
    // ...
    private usuarioService: UsuarioService,

    @Inject(ACTOR_CONTEXT_SYSTEM)
    private actorContextSystem: ActorContext,
  ) {}

  @ResolveReference()
  async resolveReference(reference: { __typename: string; id: string }): Promise<UsuarioType> {
    return this.usuarioService.usuarioFindByIdStrictSimple(this.actorContextSystem, reference.id);
  }

  // START: queries

  @Query(() => UsuarioType)
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

  @Mutation(() => UsuarioType)
  async usuarioCreate(
    @ResolveActorContext()
    actorContext: ActorContext,

    @ValidatedArgs('dto', UsuarioCreateInputZod)
    dto: UsuarioCreateInputType,
  ) {
    return this.usuarioService.usuarioCreate(actorContext, dto);
  }

  @Mutation(() => UsuarioType)
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
    parent: UsuarioType,
  ) {
    return this.usuarioService.getUsuarioNome(actorContext, parent.id);
  }

  @ResolveField('email', () => String, { nullable: true })
  async email(
    @ResolveActorContext()
    actorContext: ActorContext,

    @Parent()
    parent: UsuarioType,
  ) {
    return this.usuarioService.getUsuarioEmail(actorContext, parent.id);
  }

  @ResolveField('matriculaSiape', () => String, { nullable: true })
  async matriculaSiape(
    @ResolveActorContext()
    actorContext: ActorContext,

    @Parent()
    parent: UsuarioType,
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
    parent: UsuarioType,
  ) {
    return this.usuarioService.getUsuarioDateCreated(actorContext, parent.id);
  }

  @ResolveField('dateUpdated', () => Date)
  async dateUpdated(
    @ResolveActorContext()
    actorContext: ActorContext,

    @Parent()
    parent: UsuarioType,
  ) {
    return this.usuarioService.getUsuarioDateUpdated(actorContext, parent.id);
  }

  @ResolveField('dateDeleted', () => Date, { nullable: true })
  async dateDeleted(
    @ResolveActorContext()
    actorContext: ActorContext,

    @Parent()
    parent: UsuarioType,
  ) {
    return this.usuarioService.getUsuarioDateDeleted(actorContext, parent.id);
  }

  // END: fields graphql-resolvers
}
