import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateGradeInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
