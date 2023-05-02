import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Candidate } from 'src/candidates/entities/candidate.entity';
import { CategorySettings } from 'src/category-settings/entities/category-setting.entity';
import { Controller } from 'src/controllers/entities/controller.entity';
import { Programme } from 'src/programmes/entities/programme.entity';
import { Section } from 'src/sections/entities/section.entity';
import { TeamManager } from 'src/team-managers/entities/team-manager.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Category {

  // Primary generated ID

  @Field(() => Int, { description: '' })
  @PrimaryGeneratedColumn()
  id: number;

  // Normal columns

  @Column({unique:true})
  @Field()
  name: string;

  // OneToOne relations
  
  @Field(()=> CategorySettings)
  @OneToOne(() => CategorySettings , (settings)=> settings)
  @JoinColumn()
  settings : CategorySettings ;

  // OneToMany relations

  @OneToMany(() => Candidate, (Candidate) => Candidate.category)
  @JoinColumn()
  @Field(()=> [Candidate] , {nullable:true})
  candidates: Candidate[];

  @OneToMany(() => Programme, (programme) => programme.category)
  @JoinColumn()
  @Field(() => [Programme], { nullable: true })
  programmes: Programme[];

  // ManyTOOne relations

  @ManyToOne(() => Section, (section) => section.categories , { eager: true , onDelete : 'SET NULL'})
  @Field(() => Section )
  section: Section;

  // ManyToMany relations

  @ManyToMany(() => Controller ,(controller) => controller.categories)
  @Field(()=> [Controller] , {nullable:true})
  controllers : Controller[] ;

  @ManyToMany(() => TeamManager ,(teamManagers) => teamManagers.categories)
  @Field(()=> [TeamManager] , {nullable:true})
  teamManagers : TeamManager[] ;
  
  // Dates

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  updatedAt: Date;

}
