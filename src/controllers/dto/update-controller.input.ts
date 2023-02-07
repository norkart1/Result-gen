import { CreateControllerInput } from './create-controller.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateControllerInput extends PartialType(CreateControllerInput) {
  @Field(() => Int)
  id: number;
}
