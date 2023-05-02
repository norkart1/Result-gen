import { InputType, Int, Field } from '@nestjs/graphql';
import { Gender } from '../entities/candidate.entity';
import { IsEnum, IsInt, IsNotEmpty } from 'class-validator';

@InputType()
export class CreateCandidateInput {
  @IsNotEmpty()
  @Field()
  name: string;

  @IsInt()
  @Field(() => Int, { nullable: true })
  class: number;

  @IsInt()
  @Field({ nullable: true })
  adno: number;


  @Field({ nullable: true })
  dob: string;

  @IsInt()
  @Field(() => Int, { nullable: true })
  chestNO : number;


  @IsEnum(Gender)
  @Field(() => Gender)
  gender: Gender;

  @Field( { nullable: true })
  team: string;

  @Field( { nullable: true })
  section: string;

  @Field({ nullable: true })
  category: string;
}
