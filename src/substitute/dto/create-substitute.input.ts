import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateSubstituteInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
