import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Grade {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
