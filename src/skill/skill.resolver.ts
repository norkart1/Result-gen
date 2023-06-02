import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { SkillService } from './skill.service';
import { Skill } from './entities/skill.entity';
import { CreateSkillInput } from './dto/create-skill.input';
import { UpdateSkillInput } from './dto/update-skill.input';
import { AuthPipe } from './pipe/auth.pipe';
import { UsePipes } from '@nestjs/common';

@Resolver(() => Skill)
export class SkillResolver {
  constructor(private readonly skillService: SkillService) {}

  @UsePipes(AuthPipe)
  @Mutation(() => Skill)
  createSkill(@Args('createSkillInput') createSkillInput: CreateSkillInput) {
    return this.skillService.create(createSkillInput);
  }

  @Query(() => [Skill], { name: 'skills' })
  findAll() {
    return this.skillService.findAll();
  }

  @Query(() => Skill, { name: 'skill' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.skillService.findOne(id);
  }

  @UsePipes(AuthPipe)
  @Mutation(() => Skill)
  updateSkill(@Args('updateSkillInput') updateSkillInput: UpdateSkillInput) {
    return this.skillService.update(updateSkillInput.id, updateSkillInput);
  }

  @Mutation(() => Skill)
  removeSkill(@Args('id', { type: () => Int }) id: number) {
    return this.skillService.remove(id);
  }
}
