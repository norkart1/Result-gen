import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CandidateProgrammeService } from './candidate-programme.service';
import { CandidateProgramme } from './entities/candidate-programme.entity';
import { CreateCandidateProgrammeInput } from './dto/create-candidate-programme.input';
import { UpdateCandidateProgrammeInput } from './dto/update-candidate-programme.input';
import { UsePipes } from '@nestjs/common';
import { CandidateProgrammePipe } from './pipe/candidate-programme.pipe';
import { AddResult } from './dto/add-result.dto';

@Resolver(() => CandidateProgramme)
export class CandidateProgrammeResolver {
  constructor(private readonly candidateProgrammeService: CandidateProgrammeService) {}

  @UsePipes(CandidateProgrammePipe)
  @Mutation(() => CandidateProgramme)
  createCandidateProgramme(@Args('createCandidateProgrammeInput') createCandidateProgrammeInput: CreateCandidateProgrammeInput) {
    return this.candidateProgrammeService.create(createCandidateProgrammeInput);
  }

  @Query(() => [CandidateProgramme], { name: 'candidateProgrammes' })
  findAll() {
    return this.candidateProgrammeService.findAll();
  }

  @Query(() => CandidateProgramme, { name: 'candidateProgramme' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.candidateProgrammeService.findOne(id);
  }

  @UsePipes(CandidateProgrammePipe)
  @Mutation(() => CandidateProgramme)
  updateCandidateProgramme(@Args('updateCandidateProgrammeInput') updateCandidateProgrammeInput: UpdateCandidateProgrammeInput) {
    return this.candidateProgrammeService.update(updateCandidateProgrammeInput.id, updateCandidateProgrammeInput);
  }

  @Mutation(() => CandidateProgramme)
  removeCandidateProgramme(@Args('id', { type: () => Int }) id: number) {
    return this.candidateProgrammeService.remove(id);
  }
  
  @Mutation(() => [CandidateProgramme])
  addNormalResult(@Args('programmeCode') programmeCode: string , @Args({ name: 'addResult', type: () => [AddResult] }) addResult:AddResult[]) {
    return this.candidateProgrammeService.addResult(programmeCode,addResult)
  }

}
