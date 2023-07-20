import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Programme } from 'src/programmes/entities/programme.entity';
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Judge {
  
    // Primary Generated columns
  
    @Field(() => Int)
    @PrimaryGeneratedColumn()
    id: number;
  
    // Normal Columns
  
    @Column({unique:true})
    @Field()
    username : string;
  
    @Column()
    @Field()
    password : string;

    @Column()
    @Field()
    judgeName : string;

    // OneTOMany relations
  
    @ManyToOne(()=> Programme , (programme)=> programme.judges , {nullable:true})
    @Field(()=>Programme)
    programme : Programme ;
    
    // Dates
       
    @CreateDateColumn()
    @Field(() => Date)
    createdAt: Date;
  
    @UpdateDateColumn()
    @Field(() => Date)
    updatedAt: Date;
  


}
