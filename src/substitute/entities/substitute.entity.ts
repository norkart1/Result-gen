import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@ObjectType()
export class Substitute {
  
    // Primary Generated columns
  
    @Field(() => Int, { description: '' })
    @PrimaryGeneratedColumn()
    id: number;
  
    // Normal Columns
  
    @Column({unique:true})
    @Field()
    chestNo : string;
  
    @Column()
    @Field()
    programmeCode : string;
  
  
    // OneTOMany relations
  
    // @ManyToOne(()=> Programme , (programme)=> programme.judges , {nullable:true})
    // @Field(()=>Programme)
    // programme : Programme ;
    
    // Dates
    
    @CreateDateColumn()
    @Field(() => Date)
    createdAt: Date;
  
    @UpdateDateColumn()
    @Field(() => Date)
    updatedAt: Date;
  

}
