import { InputType, Field } from '@nestjs/graphql';
import { Exclude } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class LoginInput {
  @IsNotEmpty()
  @Field()
  username: string;

  @IsNotEmpty()
  @Field()
  password: string;

  @IsNotEmpty()
  @Field()
  role: string;
}
