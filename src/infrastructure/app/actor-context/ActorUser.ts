import { IRequestUser } from '@sisgea/nest-sso';
import { IActorUser } from '../../../domain';
import { AuthenticatedEntityType, IUserRef } from '../../../domain/authentication';
import { Actor } from './Actor';

export class ActorUser extends Actor implements IActorUser {
  userRef: IUserRef;

  readonly type: AuthenticatedEntityType.USER = AuthenticatedEntityType.USER;

  constructor(userRef: IUserRef) {
    super();
    this.userRef = userRef;
  }

  static forUserRef(userRef: IUserRef) {
    return new ActorUser(userRef);
  }

  static forUser(userId: string) {
    const userRef: IUserRef = { id: userId };
    return ActorUser.forUserRef(userRef);
  }

  static forRequestUser(requestUser: IRequestUser | null) {
    if (requestUser !== null) {
      return ActorUser.forUser(requestUser.sub);
    }

    return ActorUser.forAnonymous();
  }
}
