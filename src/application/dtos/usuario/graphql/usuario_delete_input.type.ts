import { Field, ID, InputType } from '@nestjs/graphql';
import { IUsuarioDeleteInput } from '../../../../domain';

@InputType('UsuarioDeleteInput')
export class UsuarioDeleteInputType implements IUsuarioDeleteInput {
  @Field(() => ID)
  id!: string;
}
