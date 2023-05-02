import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class CreateCategorySettingInput {

  @Field()
  @IsNotEmpty()
  category: string;

  @Field(() => Int)
  @IsNotEmpty()
  maxProgram: number;

  @Field(() => Int)
  @IsNotEmpty()
  maxSingle: number;

  @Field(() => Int)
  @IsNotEmpty()
  minProgram: number;

  @Field(() => Int)
  @IsNotEmpty()
  minSingle: number;

  @Field(() => Int)
  @IsNotEmpty()
  maxGroup: number;

  @Field(() => Int)
  @IsNotEmpty()
  minGroup: number;
  
}
