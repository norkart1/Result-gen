import { InputType, Int, Field, Float } from '@nestjs/graphql'
import { Type } from 'class-transformer'
import { IsNotEmpty, Max, Min, ValidateNested , } from 'class-validator'
import { arrayInput } from './array-input.dto'

@InputType()
export class AddResult {
  @Field(() => Int)
  @IsNotEmpty()
  chestNo: number

  @Field(() => Float , {nullable:true})
  @IsNotEmpty()
  @Min(0)
  @Max(10)
  mark: number
}
