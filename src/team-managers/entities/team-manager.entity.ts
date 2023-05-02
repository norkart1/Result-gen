import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Category } from 'src/category/entities/category.entity';
import { Team } from 'src/teams/entities/team.entity';
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@ObjectType()
@Entity()
export class TeamManager {

  // Primary generated ID
  
  @Field(() => Int, { description: '' })
  @PrimaryGeneratedColumn()
  id: number;

  // Normal columns

  @Column({unique:true})
  @Field()
  username: string;

  @Column()
  @Field()
  password: string;

  // ManyToOne relations
  
  @ManyToOne(()=>Team , (team)=>team.manager , { eager: true , onDelete : 'SET NULL'})
  @Field(()=>Team , {nullable:true})
  team : Team ;

  // ManyToOne relations

  @ManyToMany(()=> Category)
  @JoinTable()
  @Field(()=>[Category])
  categories : Category[];

  // Dates

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  updatedAt: Date;


}
