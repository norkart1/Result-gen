import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Expose } from 'class-transformer';
import { Candidate } from 'src/candidates/entities/candidate.entity';
import { Grade } from 'src/grades/entities/grade.entity';
import { Position } from 'src/position/entities/position.entity';
import { Programme } from 'src/programmes/entities/programme.entity';
import { Column, CreateDateColumn, Entity, JoinTable, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@ObjectType()
@Entity()
export class CandidateProgramme {

  // Primary generated ID

  @Field(() => Int, { description: '' })
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'id',
  })
  id: number;

  // Normal columns

  @Field(()=>Int , { nullable: true })
  @Column({ nullable: true }) 
  checkToReadNo: number;
  
  @Field(()=>Int ,{ nullable: true })
  @Column({ nullable: true })
  point: number;

  @Field({ nullable: true })
  @Column({ nullable: true }) 
  link : string ;

  @Field(()=>Int , {nullable:true})
  @Column({nullable:true})
  groupNumber : number ;

  @Field(()=>Int , {nullable:true})
  @Column({nullable:true})
  markOne : number ;

  @Field(()=>Int , {nullable:true})
  @Column({nullable:true})
  markTwo : number ;

  @Field(()=>Int , {nullable:true})
  @Column({nullable:true})
  markThree : number ;

  
  // ManyToOne relations
  
  @Field(()=>Position , {nullable:true})
  @ManyToOne(()=>Position , (position)=> position.candidateProgramme, { eager: true , onDelete : 'SET NULL'} )
  position: Position;

  @Field(()=>Grade , {nullable:true})
  @ManyToOne(()=>Grade , (grade)=> grade.candidateProgramme , { eager: true , onDelete : 'SET NULL'} )
  grade: Grade;

  @Field(()=> Programme)
  @ManyToOne(() => Programme, (programme) => programme.candidateProgramme, { eager: true , onDelete : 'SET NULL'})
  @JoinTable()
  programme: Programme;

  @Field(()=> Candidate)
  @ManyToOne(() => Candidate, (candidate) => candidate.candidateProgrammes, { eager: true , onDelete : 'SET NULL'})
  @JoinTable()
  candidate: Candidate;

   // Dates

   @CreateDateColumn()
   @Field(() => Date)
   createdAt: Date;
 
   @UpdateDateColumn()
   @Field(() => Date)
   updatedAt: Date;
}
