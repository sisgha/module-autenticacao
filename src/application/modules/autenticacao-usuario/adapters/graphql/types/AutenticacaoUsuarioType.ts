import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';
import { SisgeaAutenticacaoUsuarioModel } from '@sisgea/spec';

@ObjectType('Usuario')
@Directive('@key(fields: "id")')
export class AutenticacaoUsuarioType implements SisgeaAutenticacaoUsuarioModel {
  @Field(() => ID)
  id!: string;

  // ...

  @Field(() => String, { nullable: true })
  nome!: string | null;

  @Field(() => String, { nullable: true })
  email!: string | null;

  @Field(() => String, { nullable: true })
  matriculaSiape!: string | null;

  // ...

  @Field(() => Date)
  dateCreated!: Date;

  @Field(() => Date)
  dateUpdated!: Date;

  @Field(() => Date, { nullable: true })
  dateDeleted!: Date | null;
}
