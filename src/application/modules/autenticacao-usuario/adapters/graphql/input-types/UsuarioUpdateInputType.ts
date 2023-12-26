import {Field, ID, InputType} from '@nestjs/graphql';
import {IUsuarioUpdateInput} from '@sisgea/spec';

@InputType('UsuarioUpdateInput')
export class UsuarioUpdateInputType implements IUsuarioUpdateInput {
  @Field(() => ID)
  id!: string;

  @Field(() => String, {nullable: true})
  nome?: string;

  @Field(() => String, {nullable: true})
  email?: string;

  @Field(() => String, {nullable: true})
  matriculaSiape?: string;
}
