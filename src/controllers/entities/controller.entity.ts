import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Category } from 'src/category/entities/category.entity';
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Controller {

  // Primary generated ID

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

  // ManyToMany relations
  @ManyToMany(()=> Category)
  @JoinTable()
  @Field(()=>[Category])
  categories : Category[] ;

  // Dates
  
  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  updatedAt: Date;
}
