import {Field, InputType} from '@nestjs/graphql';
import {IUsuarioCreateInput} from '@sisgea/spec';

@InputType('UsuarioCreateInput')
export class UsuarioCreateInputType implements IUsuarioCreateInput {
  @Field()
  nome!: string;

  @Field()
  email!: string;

  @Field({nullable: true})
  matriculaSiape!: string;
}
