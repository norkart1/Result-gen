import { ObjectType, Field, Int, registerEnumType } from '@nestjs/graphql';
import { Expose } from 'class-transformer';
import { CandidateProgramme } from 'src/candidate-programme/entities/candidate-programme.entity';
import { Category } from 'src/category/entities/category.entity';
import { Section } from 'src/sections/entities/section.entity';
import { Skill } from 'src/skill/entities/skill.entity';
import { Column, CreateDateColumn, Entity, JoinTable, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';


export enum Mode {
  STAGE = 'STAGE',
  NON_STAGE = 'NON_STAGE',
  OUTDOOR_STAGE = 'OUTDOOR_STAGE'
}

export enum Type {
  SINGLE = 'SINGLE',
  GROUP = 'GROUP',
  HOUSE = 'HOUSE'
}

registerEnumType(Mode, {
  name: 'Models',
});

registerEnumType(Type, {
  name: 'Types',
});

@ObjectType()
@Entity()
export class Programme {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  @PrimaryGeneratedColumn()
  id: number;

  @Column({unique:true})
  @Field()
  programCode: string;

  @Column()
  @Field()
  name: string;

  @OneToMany(() => CandidateProgramme, (CandidateProgramme) => CandidateProgramme.programme)
  @JoinTable()
  candidateProgramme: CandidateProgramme[];

  @Column()
  @Field(()=> Mode)
  mode: Mode;

  @Column()
  @Field(()=> Type)
  type: Type;

  @Column()
  @Field(()=> Int)
  groupCandidatesCount: number;

  @Column()
  @Field(()=> Int )
  candidateCount: number;

  @Column()
  @Field()
  date: string;

  @Column()
  @Field()
  time: string;

  @Column()
  @Field(()=> Int )
  venue: number;

  @Column()
  @Field(()=> Int)
  duration: number;

  @Column()
  @Field()
  conceptNote: string;

  @Column({default: false})
  @Field(()=> Boolean)
  resultEntered: Boolean;

  @Column({default: false})
  @Field(()=> Boolean)
  resultPublished: Boolean;

  @ManyToOne(()=> Skill, (skill) => skill.programmes)
  @Field(()=> Skill)
  skill: Skill;

  @ManyToOne(()=> Category, (category) => category.programmes)
  @Field(()=> Category)
  category : Category;

  @ManyToOne(()=> Section, (section) => section.programmes)
  @Field(()=> Section)
  section: Section;

  @Expose()
  @Field(()=> Date)
  @CreateDateColumn()
  createdAt: Date;

  @Expose()
  @Field(()=> Date)
  @UpdateDateColumn()
  updatedAt: Date;

  
}
