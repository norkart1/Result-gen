import { Resolver, Query, Mutation, Args, Int, Info } from '@nestjs/graphql';
import { SkillService } from './skill.service';
import { Skill } from './entities/skill.entity';
import { CreateSkillInput } from './dto/create-skill.input';
import { UpdateSkillInput } from './dto/update-skill.input';
import { AuthPipe } from './pipe/auth.pipe';
import { UseGuards, UsePipes } from '@nestjs/common';
import { HasRoles, RolesGuard } from 'src/credentials/roles/roles.guard';
import { Roles } from 'src/credentials/roles/roles.enum';
import { fieldsProjection } from 'graphql-fields-list';

@Resolver(() => Skill)
export class SkillResolver {
  constructor(private readonly skillService: SkillService) {}

  @UsePipes(AuthPipe)
  @Mutation(() => Skill)
  @HasRoles(Roles.Admin)
  @UseGuards(RolesGuard)
  createSkill(@Args('createSkillInput') createSkillInput: CreateSkillInput) {
    return this.skillService.create(createSkillInput);
  }

  @Query(() => [Skill], { name: 'skills' })
  findAll(
    @Info() info,
  ) {
    const fields = Object.keys(fieldsProjection(info));
    return this.skillService.findAll(fields);
  }

  @Query(() => Skill, { name: 'skill' })
  findOne(@Args('id', { type: () => Int }) id: number, @Info() info
  
  ) {
    const fields = Object.keys(fieldsProjection(info));
    return this.skillService.findOne(id , fields);
  }

  @Mutation(() => Skill)
  @HasRoles(Roles.Admin)
  @UseGuards(RolesGuard)
  updateSkill(@Args('updateSkillInput') updateSkillInput: UpdateSkillInput) {
    return this.skillService.update(updateSkillInput.id, updateSkillInput);
  }

  @Mutation(() => Skill)
  @HasRoles(Roles.Admin)
  @UseGuards(RolesGuard)
  removeSkill(@Args('id', { type: () => Int }) id: number) {
    return this.skillService.remove(id);
  }
}
