import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateTeamManagerInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
