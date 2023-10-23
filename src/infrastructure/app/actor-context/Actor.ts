import { IActor } from '../../../domain';
import { AuthenticatedEntityType } from '../../../domain/authentication';

export class Actor implements IActor {
  constructor(
    // ...
    readonly type: AuthenticatedEntityType = AuthenticatedEntityType.ANONONYMOUS,
  ) {}

  static forAnonymous() {
    return new Actor(AuthenticatedEntityType.ANONONYMOUS);
  }

  static forInternalSystem() {
    return new Actor(AuthenticatedEntityType.INTERNAL_SYSTEM);
  }
}
