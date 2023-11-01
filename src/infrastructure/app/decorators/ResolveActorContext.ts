import { Injectable, PipeTransform } from '@nestjs/common';
import { IRequestUser } from '@sisgea/nest-sso';
import { RequestUserSSOGql } from '@sisgea/nest-sso/dist/infrastructure/decorators/gql';
import { ActorContext } from '../../actor-context/ActorContext/ActorContext';
import { DatabaseService } from '../../database/database.service';

@Injectable()
export class ResolveActorContextPipe implements PipeTransform {
  constructor(
    //
    private databaseService: DatabaseService,
  ) {}

  async transform(requestUser: IRequestUser | null /* _metadata: ArgumentMetadata */) {
    const dataSource = await this.databaseService.getAppDataSource();
    return ActorContext.forRequestUser(dataSource, requestUser);
  }
}

export const ResolveActorContext = (options?: any) => RequestUserSSOGql(options, ResolveActorContextPipe);
