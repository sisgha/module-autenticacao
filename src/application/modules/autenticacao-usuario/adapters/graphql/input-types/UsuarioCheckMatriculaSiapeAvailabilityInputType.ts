import {Field, ID, InputType} from '@nestjs/graphql';
import {IUsuarioCheckMatriculaSiapeAvailabilityInput} from '@sisgea/spec';

@InputType('UsuarioCheckMatriculaSiapeAvailabilityInput')
export class UsuarioCheckMatriculaSiapeAvailabilityInputType implements IUsuarioCheckMatriculaSiapeAvailabilityInput {
  @Field(() => String)
  matriculaSiape!: string;

  @Field(() => ID, {nullable: true})
  usuarioId!: string | null;
}
