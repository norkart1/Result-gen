import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { CandidateProgrammeService } from './candidate-programme.service';
import { CandidateProgramme } from './entities/candidate-programme.entity';
import { CreateCandidateProgrammeInput } from './dto/create-candidate-programme.input';
import { UpdateCandidateProgrammeInput } from './dto/update-candidate-programme.input';
import { UseGuards, UsePipes } from '@nestjs/common';
import { CandidateProgrammePipe } from './pipe/candidate-programme.pipe';
import { AddResult } from './dto/add-result.dto';
import { ResultGenService } from './result-gen.service';
import { HasRoles, RolesGuard } from 'src/credentials/roles/roles.guard';
import { Roles } from 'src/credentials/roles/roles.enum';

@Resolver(() => CandidateProgramme)
export class CandidateProgrammeResolver {
  constructor(
    private readonly candidateProgrammeService: CandidateProgrammeService,
    private readonly resultGenService: ResultGenService,
  ) {}

  // @UsePipes(CandidateProgrammePipe)
  @HasRoles(Roles.Controller, Roles.TeamManager)
  @UseGuards(RolesGuard)
  @Mutation(() => CandidateProgramme)
  createCandidateProgramme(
    @Args('createCandidateProgrammeInput')
    createCandidateProgrammeInput: CreateCandidateProgrammeInput,
    @Context('req') req: any,
  ) {
    return this.candidateProgrammeService.create(createCandidateProgrammeInput, req.user);
  }

  @Query(() => [CandidateProgramme], { name: 'candidateProgrammes' })
  findAll() {
    return this.candidateProgrammeService.findAll();
  }

  @Query(() => CandidateProgramme, { name: 'candidateProgramme' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.candidateProgrammeService.findOne(id);
  }

  // @UsePipes(CandidateProgrammePipe)
  @Mutation(() => CandidateProgramme)
  @HasRoles(Roles.Controller, Roles.TeamManager)
  @UseGuards(RolesGuard)
  updateCandidateProgramme(
    @Args('updateCandidateProgrammeInput')
    updateCandidateProgrammeInput: UpdateCandidateProgrammeInput,
  ) {
    return this.candidateProgrammeService.update(
      updateCandidateProgrammeInput.id,
      updateCandidateProgrammeInput,
    );
  }

  @Mutation(() => CandidateProgramme)
  @HasRoles(Roles.Controller, Roles.TeamManager)
  @UseGuards(RolesGuard)
  removeCandidateProgramme(@Args('id', { type: () => Int }) id: number) {
    return this.candidateProgrammeService.remove(id);
  }

  @Mutation(() => [CandidateProgramme])
  @HasRoles(Roles.Controller)
  addNormalResult(
    @Args('programmeCode') programmeCode: string,
    @Args({ name: 'addResult', type: () => [AddResult] })
    addResult: AddResult[],
  ) {
    return this.resultGenService.addResult(programmeCode, addResult);
  }
}
