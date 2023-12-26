import { Field, ID, InputType } from '@nestjs/graphql';
import { IUsuarioCheckEmailAvailabilityInput } from '@sisgea/spec';

@InputType('UsuarioCheckEmailAvailabilityInput')
export class UsuarioCheckEmailAvailabilityInputType implements IUsuarioCheckEmailAvailabilityInput {
  @Field(() => String)
  email!: string;

  @Field(() => ID, { nullable: true })
  usuarioId!: string | null;
}
