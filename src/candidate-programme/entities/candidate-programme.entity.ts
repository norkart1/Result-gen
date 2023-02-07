import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Expose } from 'class-transformer';
import { Candidate } from 'src/candidates/entities/candidate.entity';
import { Programme } from 'src/programmes/entities/programme.entity';
import { Column, Entity, JoinTable, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class CandidateProgramme {
  @Field(() => Int, { description: '' })
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'id',
  })
  id: number;

  @Field()
  @Column({ nullable: true }) 
  status: string;

  @Field()
  @Column({ nullable: true })
  position: string;

  @Field()
  @Column({ nullable: true })
  grade: string;

  @Field(()=>Int)
  @Column({ nullable: true })
  point: number;

  @Field(()=> Programme)
  @ManyToOne(() => Programme, (programme) => programme.candidateProgramme, { eager: true })
  @JoinTable()
  programme: Programme;

  @Field(()=> Candidate)
  @ManyToOne(() => Candidate, (candidate) => candidate.candidateProgrammes, { eager: true })
  @JoinTable()
  candidate: Candidate;
}
