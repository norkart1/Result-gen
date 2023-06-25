import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
  Context,
} from '@nestjs/graphql';
import { CandidatesService } from './candidates.service';
import { Candidate } from './entities/candidate.entity';
import { CreateCandidateInput } from './dto/create-candidate.input';
import { UpdateCandidateInput } from './dto/update-candidate.input';
import { UseGuards } from '@nestjs/common';
import { CandidatePipe } from './pipe/candidates.pipe';
import { Section } from 'src/sections/entities/section.entity';
import { SectionsService } from 'src/sections/sections.service';
import { HasRoles, RolesGuard } from 'src/credentials/roles/roles.guard';
import { Roles } from 'src/credentials/roles/roles.enum';

@Resolver(() => Candidate)
export class CandidatesResolver {
  constructor(
    private readonly candidatesService: CandidatesService,
    private readonly sectionService: SectionsService,
  ) {}

  // @UsePipes(CandidatePipe)
  @Mutation(() => Candidate)
  @HasRoles(Roles.Controller)
  @UseGuards(RolesGuard)
  createCandidate(
    @Args('createCandidateInput') createCandidateInput: CreateCandidateInput,
    @Context('req') req: any,
  ) {
    return this.candidatesService.create(createCandidateInput, req.user);
  }

  @Mutation(() => [Candidate])
  @HasRoles(Roles.Controller)
  @UseGuards(RolesGuard)
  createManyCandidates(
    @Args('createCandidateInput', { type: () => [CreateCandidateInput] })
    createCandidateInput: CreateCandidateInput[],
    @Context('req') req: any,
  ) {
    return this.candidatesService.createMany(createCandidateInput, req.user);
  }

  @Query(() => [Candidate], { name: 'candidates' })
  findAll() {
    return this.candidatesService.findAll();
  }

  @Query(() => Candidate, { name: 'candidate' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.candidatesService.findOne(id);
  }

  
  @Mutation(() => Candidate)
  @HasRoles(Roles.Controller)
  @UseGuards(RolesGuard)
  updateCandidate(
    @Args('updateCandidateInput') updateCandidateInput: UpdateCandidateInput,
    @Context('req') req: any,
  ) {
    return this.candidatesService.update(updateCandidateInput.id, updateCandidateInput, req.user);
  }

  @Mutation(() => Candidate)
  @HasRoles(Roles.Controller)
  @UseGuards(RolesGuard)
  removeCandidate(@Args('id', { type: () => Int }) id: number, @Context('req') req: any) {
    return this.candidatesService.remove(id, req.user);
  }
}
