import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Candidate } from 'src/candidates/entities/candidate.entity';
import { Category } from 'src/category/entities/category.entity';
import { Programme } from 'src/programmes/entities/programme.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Section {

  // Primary generated ID
  @Field(() => Int, { description: '' })
  @PrimaryGeneratedColumn()
  id: number;

  // Normal columns
  @Column({unique:true})
  @Field()
  name: string;

  // OneToMany relations

  @OneToMany(() => Category, (category) => category.section)
  @JoinColumn()
  @Field(() => [Category] , { nullable: true })
  categories : Category[] ;

  @OneToMany(() => Candidate, (Candidate) => Candidate.section)
  @Field(()=> [Candidate] , {nullable:true})
  candidates: Candidate[];

  @OneToMany(() => Programme, (programme) => programme.section)
  @Field(() => [Programme], { nullable: true })
  programmes: Programme[];

  // Dates
  
  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  updatedAt: Date;

}
