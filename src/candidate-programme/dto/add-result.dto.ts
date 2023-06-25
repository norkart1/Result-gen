import { InputType, Int, Field, Float } from '@nestjs/graphql'
import { IsNotEmpty } from 'class-validator'

@InputType()
export class AddResult {
  @Field(() => Int)
  @IsNotEmpty()
  chestNo: number

  @Field(() => Float, { nullable: true })
  totalMark: number

  @Field(() => Int, { nullable: true })
  Position: number

  @Field(() => Float)
  @IsNotEmpty()
  markOne: number

  @Field(() => Float, { nullable: true })
  markTwo: number

  @Field(() => Float, { nullable: true })
  markThree: number
}
