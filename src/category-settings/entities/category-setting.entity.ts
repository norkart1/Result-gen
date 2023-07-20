import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Category } from 'src/category/entities/category.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class CategorySettings {

  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number

  // MAX 

  @Field(() => Int)
  @Column()
  maxProgram: number;
 
  @Field(() => Int)
  @Column()
  maxSingle: number;
  
  @Field(() => Int)
  @Column()
  maxGroup : number;

  @Field(() => Int)
  @Column()
  maxStage: number;

  @Field(() => Int)
  @Column()
  maxNonStage: number;

  @Field(() => Int)
  @Column()
  maxOutDoor: number;

  // MIN
  @Field(() => Int)
  @Column()
  minProgram: number;

  @Field(() => Int)
  @Column()
  minSingle: number;

  @Field(() => Int)
  @Column()
  minGroup : number;
  
  @Field(() => Int)
  @Column()
  minStage: number;

  @Field(() => Int)
  @Column()
  minNonStage: number;

  @Field(() => Int)
  @Column()
  minOutDoor: number;
  

  @Field(() => Boolean)
  @Column()
  isProgrammeListUpdatable: boolean;

  @OneToOne(()=> Category , (category)=> category.settings)
  @Field(()=>Category)
  category:Category;

}
