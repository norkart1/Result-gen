import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, CreateDateColumn, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Candidate } from 'src/candidates/entities/candidate.entity';
import { Expose } from 'class-transformer';
import { TeamManager } from '../../team-managers/entities/team-manager.entity';

@ObjectType()
@Entity()
export class Team {

  @PrimaryGeneratedColumn()
  @Field(() => Int, { description: '' })
  id: number;

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

  @Expose({ name: 'chest_no_series'})
  @Column({nullable:true})
  @Field(()=> Int ,{nullable:true})
  chestNoSeries: number;

  // @Column({ nullable: true, type: 'json' })
  // coverPhoto: Photo;

  @OneToMany(() => Candidate,(candidate) => candidate.team)
  @Field(()=> [Candidate] , {nullable:true})
  candidates:Candidate[];

  @OneToOne(() => TeamManager)
  @Field()
  team : TeamManager;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  updatedAt: Date;


}
