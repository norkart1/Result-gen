import { InputType, Int, Field } from '@nestjs/graphql';
import { IsBoolean, IsNotEmpty } from 'class-validator';

@InputType()
export class CreateDetailInput {
  @IsNotEmpty()
  @Field()
  name:string;

  @Field()
  motto:string;
 
  @Field()
  institution:string;

  @Field()
  description:string;
 
  @Field()
  @IsBoolean()
  isMediaHave : Boolean;
 
}
