import { CreateTeamManagerInput } from './create-team-manager.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateTeamManagerInput extends PartialType(CreateTeamManagerInput) {
  @Field(() => Int)
  id: number;
}
