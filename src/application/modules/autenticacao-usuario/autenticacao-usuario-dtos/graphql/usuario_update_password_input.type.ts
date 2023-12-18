import { Field, ID, InputType } from '@nestjs/graphql';
import { IUsuarioUpdatePasswordInput } from '../../../../../domain';

@InputType('UsuarioUpdatePasswordInput')
export class UsuarioUpdatePasswordInputType implements IUsuarioUpdatePasswordInput {
  @Field(() => ID)
  id!: string;

  @Field(() => String, { nullable: false })
  currentPassword!: string;

  @Field(() => String, { nullable: false })
  newPassword!: string;

  @Field(() => String, { nullable: false })
  confirmNewPassword!: string;
}
