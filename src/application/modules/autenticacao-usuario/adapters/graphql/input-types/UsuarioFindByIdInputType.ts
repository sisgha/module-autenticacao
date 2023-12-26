import { Field, ID, InputType } from '@nestjs/graphql';
import { IUsuarioFindByIdInput } from '@sisgea/spec';

@InputType('UsuarioFindByIdInput')
export class UsuarioFindByIdInputType implements IUsuarioFindByIdInput {
  @Field(() => ID)
  id!: string;
}
