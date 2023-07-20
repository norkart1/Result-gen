import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { JudgeService } from './judge.service';
import { Judge } from './entities/judge.entity';
import { CreateJudgeInput } from './dto/create-judge.input';
import { UpdateJudgeInput } from './dto/update-judge.input';
import { HasRoles, RolesGuard } from 'src/credentials/roles/roles.guard';
import { Roles } from 'src/credentials/roles/roles.enum';
import { UseGuards } from '@nestjs/common';
import { arrayInput } from 'src/candidate-programme/dto/array-input.dto';

@Resolver(() => Judge)
export class JudgeResolver {
  constructor(private readonly judgeService: JudgeService) {}

  @Mutation(() => Judge)
  // @HasRoles(Roles.Controller)
  // @UseGuards(RolesGuard)
  createJudge(@Args('createJudgeInput') createJudgeInput: CreateJudgeInput) {
    return this.judgeService.create(createJudgeInput);
  }

  @Query(() => [Judge], { name: 'judges' })
  findAll() {
    return this.judgeService.findAll();
  }

  @Query(() => Judge, { name: 'judge' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.judgeService.findOne(id);
  }

  @Mutation(() => Judge)
  @HasRoles(Roles.Controller)
  @UseGuards(RolesGuard)
  updateJudge(@Args('updateJudgeInput') updateJudgeInput: UpdateJudgeInput) {
    return this.judgeService.update(updateJudgeInput.id, updateJudgeInput);
  }

  @Mutation(() => Judge)
  @HasRoles(Roles.Controller)
  @UseGuards(RolesGuard)
  removeJudge(@Args('id', { type: () => Int }) id: number) {
    return this.judgeService.remove(id);
  }

  @Mutation(() => Judge)
  uploadMarkByJudge(
    @Args('programmeCode') programmeCode: string,
    @Args('jugdeId') JudgeId: number,
    @Args({ name: 'addResult', type: () => arrayInput })
    addResult: arrayInput,
    ) {
    return this.judgeService.uploadMarkByJudge(JudgeId ,programmeCode, addResult);
  }
}
