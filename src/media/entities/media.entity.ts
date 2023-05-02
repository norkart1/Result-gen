import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Media {

  // Primary Generated ID

  @Field(() => Int, { description: '' })
  @PrimaryGeneratedColumn()
  id:number;

  // Normal columns
  @Column({unique:true})
  @Field()
  username:string;

  @Column()
  @Field()
  password:string;

  // Dates
  
  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  updatedAt: Date;

}
