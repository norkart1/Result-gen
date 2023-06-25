import { ObjectType, Field, Int, registerEnumType } from '@nestjs/graphql';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Roles } from '../roles/roles.enum';
import { Category } from 'src/category/entities/category.entity';
import { Team } from 'src/teams/entities/team.entity';

registerEnumType(Roles, {
  name: 'Roles',
});

@ObjectType()
@Entity()
export class Credential {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ unique: true, nullable: false })
  username: string;

  @Column({ nullable: false })
  password: string;

  @Field()
  @Column('json')
  roles: string;

  @ManyToMany(() => Category)
  @JoinTable()
  @Field(() => [Category])
  categories: Category[];

  @ManyToOne(() => Team, team => team.creadentials, { eager: true, onDelete: 'SET NULL' })
  @Field(() => Team, { nullable: true })
  team?: Team;
}
