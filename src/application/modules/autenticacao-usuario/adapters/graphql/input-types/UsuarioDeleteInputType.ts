import { Field, ID, InputType } from '@nestjs/graphql';
import { IUsuarioDeleteInput } from '@sisgea/spec';

@InputType('UsuarioDeleteInput')
export class UsuarioDeleteInputType implements IUsuarioDeleteInput {
  @Field(() => ID)
  id!: string;
}
