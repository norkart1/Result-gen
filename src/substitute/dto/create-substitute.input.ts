import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber } from 'class-validator';

@InputType()
export class CreateSubstituteInput {

  @IsNotEmpty()

    @Field()
    reason : string;
  
    @IsNotEmpty()
    @Field()
    programme : string  ;

    @IsNotEmpty()
    @IsNumber()
    @Field(()=>Int)
    oldCandidate : number;

    @IsNotEmpty()
    @IsNumber()
    @Field(()=>Int )
    newCandidate : number;
}
