import { ObjectType, Field, Int } from '@nestjs/graphql';
import { CandidateProgramme } from 'src/candidate-programme/entities/candidate-programme.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class Position {
  // Primary generated ID

  @Field(() => Int, { description: '' })
  @PrimaryGeneratedColumn()
  id: number;

  // Normal columns
  @Column({ unique: true })
  @Field()
  name: string;

  @Column({ unique: true })
  @Field(() => Int)
  value: number;

  @Column()
  @Field(() => Int)
  pointGroup: number;

  @Column()
  @Field(() => Int)
  pointSingle: number;

  @Column()
  @Field(() => Int)
  pointHouse: number;

  // OneToMany relations

  @Field(() => CandidateProgramme)
  @OneToMany(() => CandidateProgramme, candidateProgramme => candidateProgramme.position)
  candidateProgramme: CandidateProgramme;
  // Dates

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  updatedAt: Date;
}
