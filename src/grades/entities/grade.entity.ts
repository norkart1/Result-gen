import { ObjectType, Field, Int } from '@nestjs/graphql';
import { CandidateProgramme } from 'src/candidate-programme/entities/candidate-programme.entity';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Grade {

  // Primary Generated columns

  @Field(() => Int, { description: '' })
  @PrimaryGeneratedColumn()
  id: number;

  // Normal Columns

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

  @Column()
  @Field(()=> Int)
  percentage : number;

  // OneTOMany relations

  @Field(()=>CandidateProgramme)
  @OneToMany(()=>CandidateProgramme , (candidateProgramme)=>candidateProgramme.grade)
  candidateProgramme : CandidateProgramme ;
  
  // Dates
  
  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  updatedAt: Date;


}
