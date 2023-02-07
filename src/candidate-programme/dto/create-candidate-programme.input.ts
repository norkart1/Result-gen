import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateCandidateProgrammeInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
