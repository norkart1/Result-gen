import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Section {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
