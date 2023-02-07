import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Media {
  @Field(() => Int, { description: '' })
  @PrimaryGeneratedColumn()
  id:number;

  @Column({unique:true})
  @Field()
  username:string;

  @Column()
  @Field()
  password:string;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  updatedAt: Date;

}
