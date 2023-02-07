import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CandidatesService } from './candidates.service';
import { Candidate } from './entities/candidate.entity';
import { CreateCandidateInput } from './dto/create-candidate.input';
import { UpdateCandidateInput } from './dto/update-candidate.input';
import { UsePipes } from '@nestjs/common';
import { CandidatePipe } from './pipe/candidates.pipe';

@Resolver(() => Candidate)
export class CandidatesResolver {
  constructor(private readonly candidatesService: CandidatesService) {}

  @UsePipes(CandidatePipe)
  @Mutation(() => Candidate)
  createCandidate(@Args('createCandidateInput') createCandidateInput: CreateCandidateInput) {
    return this.candidatesService.create(createCandidateInput);
  }

  @Query(() => [Candidate], { name: 'candidates' })
  findAll() {
    return this.candidatesService.findAll();
  }

  @Query(() => Candidate, { name: 'candidate' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.candidatesService.findOne(id);
  }

  @UsePipes(CandidatePipe)
  @Mutation(() => Candidate)
  updateCandidate(@Args('updateCandidateInput') updateCandidateInput: UpdateCandidateInput) {
    return this.candidatesService.update(updateCandidateInput.id, updateCandidateInput);
  }

  @Mutation(() => Candidate)
  removeCandidate(@Args('id', { type: () => Int }) id: number) {
    return this.candidatesService.remove(id);
  }
}
