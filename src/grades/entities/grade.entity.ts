import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Grade {
  @Field(() => Int, { description: '' })
  @PrimaryGeneratedColumn()
  id: number;

  @Column({unique:true})
  @Field()
  name: string;

  @Column()
  @Field(()=> Int)
  pointGroup : number;

  @Column()
  @Field(()=> Int)
  pointSingle : number;

  @Column()
  @Field(()=> Int)
  pointHouse : number;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  updatedAt: Date;


}
