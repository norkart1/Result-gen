import { InputType, Int, Field } from '@nestjs/graphql';
import { Gender } from '../entities/candidate.entity';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class CreateCandidateInput {
  @IsNotEmpty()
  @Field()
  name: string;


  @Field(() => Int, { nullable: true })
  class: number;


  @Field({ nullable: true })
  adno: number;


  @Field({ nullable: true })
  dob: string;


  @Field(() => Int, { nullable: true })
  chestNO: number;


  @Field(() => Gender)
  gender: Gender;

  @Field(()=> Int )
  team_id:number;

  @Field(()=> Int )
  section_id:number;

  @Field(()=> Int)
  category_id:number;
}
