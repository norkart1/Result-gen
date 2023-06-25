import { Resolver, Mutation, Args, Int } from '@nestjs/graphql';
import { CandidateProgrammeService } from './candidate-programme.service';
import { CandidateProgramme } from './entities/candidate-programme.entity';
import { AddResult } from './dto/add-result.dto';
import { ResultGenService } from './result-gen.service';

@Resolver(() => CandidateProgramme)
export class ResultGenResolver {
  constructor(
    private readonly candidateProgrammeService: CandidateProgrammeService,
    private readonly resultGenService: ResultGenService,
  ) {}

  @Mutation(() => [CandidateProgramme])
  addNormalResult(
    @Args('programmeCode') programmeCode: string,
    @Args({ name: 'addResult', type: () => [AddResult] })
    addResult: AddResult[],
  ) {
    return this.resultGenService.addResult(programmeCode, addResult);
  }

  @Mutation(() => Int)
  async liveResult() {
    return this.resultGenService.liveResult();
  }

}
