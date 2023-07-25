import { Resolver, Mutation, Args, Int } from '@nestjs/graphql';
import { CandidateProgrammeService } from './candidate-programme.service';
import { CandidateProgramme } from './entities/candidate-programme.entity';
import { AddResult } from './dto/add-result.dto';
import { ResultGenService } from './result-gen.service';
import { arrayInput } from './dto/array-input.dto';
import { Programme } from 'src/programmes/entities/programme.entity';
import { HasRoles, RolesGuard } from 'src/credentials/roles/roles.guard';
import { Roles } from 'src/credentials/roles/roles.enum';
import { UseGuards } from '@nestjs/common';

@Resolver(() => CandidateProgramme)
export class ResultGenResolver {
  constructor(
    private readonly candidateProgrammeService: CandidateProgrammeService,
    private readonly resultGenService: ResultGenService,
  ) {}

  @Mutation(() => [CandidateProgramme])
  @HasRoles(Roles.Controller)
  @UseGuards(RolesGuard)
  addNormalResult(
    @Args('programmeCode') programmeCode: string,
    @Args({ name: 'addResult', type: () => arrayInput })
    addResult: arrayInput,
  ) {
    return this.resultGenService.addResult(programmeCode, addResult);
  }

  @Mutation(() => [CandidateProgramme])
  @HasRoles(Roles.Controller)
  @UseGuards(RolesGuard)
  approveJudgeResult(
    @Args('programmeCode') programmeCode: string,  
      @Args('judgeName') judgeName: string
  ) {
    return this.resultGenService.approveJudgeResult(programmeCode, judgeName);
  }

  @Mutation(() => Int)
  @HasRoles(Roles.Controller)
  @UseGuards(RolesGuard)
  async liveResult(
    @Args('programmeCode' , { type: () => [String] }) programmeCode: [string],
    @Args('timeInSec') timeInSec: number,
  ) {
    return this.resultGenService.liveResult(programmeCode, timeInSec);
  }

  @Mutation(()=> String)
  @HasRoles(Roles.Controller)
  @UseGuards(RolesGuard)
  async publishResults(
    @Args('programmeCode' , { type: () => [String] }) programmeCode: [string],
  ) {
    return this.resultGenService.publishResults(programmeCode);
  }

  @Mutation(() => Programme )
  @HasRoles(Roles.Controller)
  @UseGuards(RolesGuard)
  async publishResult(
    @Args('programmeCode') programmeCode: string,
  ) {
    return this.resultGenService.publishResult(programmeCode);
  }


}
