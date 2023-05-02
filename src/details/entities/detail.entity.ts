import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Detail {

  // Primary generated ID

  @Field(() => Int, { description: '' })
  @PrimaryGeneratedColumn()
  id:number;

  // Normal Columns

  @Column()
  @Field()
  name:string;

  @Column({default:'Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print,'})
  @Field()
  motto:string;

  @Column()
  @Field()
  institution:string;

  @Column({default:'Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print,'})
  @Field()
  description:string;

  @Column()
  @Field()
  isMediaHave : Boolean;
  
  // Dates

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  updatedAt: Date;
}
