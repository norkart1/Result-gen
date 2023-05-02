import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Candidate } from 'src/candidates/entities/candidate.entity';
import { Expose } from 'class-transformer';
import { TeamManager } from '../../team-managers/entities/team-manager.entity';

@ObjectType()
@Entity()
export class Team {

  // Primary generated ID

  @PrimaryGeneratedColumn()
  @Field(() => Int, { description: '' })
  id: number;

  // Normal Columns

  @Column({unique:true})
  @Field()
  name:string;

  @Column({unique:true})
  @Field()
  shortName: string;

  @Column({nullable:true})
  @Field({nullable:true})
  description: string;

  @Column({nullable:true})
  @Field({nullable:true})
  color : string


  // @Column({ nullable: true, type: 'json' })
  // coverPhoto: Photo;

  @Expose({ name: 'chest_no_series'})
  @Column({nullable:true})
  @Field(()=> Int ,{nullable:true})
  chestNoSeries: number;


  // OneToOne relations

  @OneToMany(() => TeamManager , (manager) => manager.team)
  @JoinColumn()
  @Field(()=>TeamManager , {nullable:true})
  manager : TeamManager;

  // OneToMany relations

  @OneToMany(() => Candidate,(candidate) => candidate.team)
  @Field(()=> [Candidate] , {nullable:true})
  candidates:Candidate[];

  // Dates

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  updatedAt: Date;


}
