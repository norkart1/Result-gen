import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { JudgeService } from './judge.service';
import { Judge } from './entities/judge.entity';
import { CreateJudgeInput } from './dto/create-judge.input';
import { UpdateJudgeInput } from './dto/update-judge.input';

@Resolver(() => Judge)
export class JudgeResolver {
  constructor(private readonly judgeService: JudgeService) {}

  @Mutation(() => Judge)
  createJudge(@Args('createJudgeInput') createJudgeInput: CreateJudgeInput) {
    return this.judgeService.create(createJudgeInput);
  }

  @Query(() => [Judge], { name: 'judge' })
  findAll() {
    return this.judgeService.findAll();
  }

  @Query(() => Judge, { name: 'judge' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.judgeService.findOne(id);
  }

  @Mutation(() => Judge)
  updateJudge(@Args('updateJudgeInput') updateJudgeInput: UpdateJudgeInput) {
    return this.judgeService.update(updateJudgeInput.id, updateJudgeInput);
  }

  @Mutation(() => Judge)
  removeJudge(@Args('id', { type: () => Int }) id: number) {
    return this.judgeService.remove(id);
  }
}
