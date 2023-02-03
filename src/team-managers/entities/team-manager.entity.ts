import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class TeamManager {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
