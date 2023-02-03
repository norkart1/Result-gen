import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CandidatesService } from './candidates.service';
import { Candidate } from './entities/candidate.entity';
import { CreateCandidateInput } from './dto/create-candidate.input';
import { UpdateCandidateInput } from './dto/update-candidate.input';

@Resolver(() => Candidate)
export class CandidatesResolver {
  constructor(private readonly candidatesService: CandidatesService) {}

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

  @Mutation(() => Candidate)
  updateCandidate(@Args('updateCandidateInput') updateCandidateInput: UpdateCandidateInput) {
    return this.candidatesService.update(updateCandidateInput.id, updateCandidateInput);
  }

  @Mutation(() => Candidate)
  removeCandidate(@Args('id', { type: () => Int }) id: number) {
    return this.candidatesService.remove(id);
  }
}
