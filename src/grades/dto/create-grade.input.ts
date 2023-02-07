import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber } from 'class-validator';

@InputType()
export class CreateGradeInput {
  @IsNotEmpty()
  @Field()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  @Field(()=> Int)
  pointGroup : number;

  @IsNotEmpty()
  @IsNumber()
  @Field(()=> Int)
  pointSingle : number;

  @IsNotEmpty()
  @IsNumber()
  @Field(()=> Int)
  pointHouse : number; 
}
