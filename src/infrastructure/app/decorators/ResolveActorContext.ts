import { Inject, Injectable, PipeTransform } from '@nestjs/common';
import { IRequestUser } from '@sisgea/nest-sso';
import { RequestUserSSOGql } from '@sisgea/nest-sso/dist/infrastructure/decorators/gql';
import { DataSource } from 'typeorm';
import { APP_DATA_SOURCE_TOKEN } from '../../database/tokens/APP_DATA_SOURCE_TOKEN';
import { ActorContext } from '../actor-context/ActorContext';
import { ActorUser } from '../actor-context/ActorUser';

@Injectable()
export class ResolveActorContextPipe implements PipeTransform {
  constructor(
    @Inject(APP_DATA_SOURCE_TOKEN)
    private dataSource: DataSource,
  ) {}

  async transform(requestUser: IRequestUser | null /* _metadata: ArgumentMetadata */) {
    const actor = ActorUser.forRequestUser(requestUser);
    return new ActorContext(this.dataSource, actor);
  }
}

export const ResolveActorContext = (options?: any) => RequestUserSSOGql(options, ResolveActorContextPipe);
