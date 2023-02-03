import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Programme {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
