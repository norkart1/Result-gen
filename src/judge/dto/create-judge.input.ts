import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateJudgeInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
