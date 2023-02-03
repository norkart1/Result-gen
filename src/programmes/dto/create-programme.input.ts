import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateProgrammeInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
