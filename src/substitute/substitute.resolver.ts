import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { SubstituteService } from './substitute.service';
import { Substitute } from './entities/substitute.entity';
import { CreateSubstituteInput } from './dto/create-substitute.input';
import { UpdateSubstituteInput } from './dto/update-substitute.input';

@Resolver(() => Substitute)
export class SubstituteResolver {
  constructor(private readonly substituteService: SubstituteService) {}

  @Mutation(() => Substitute)
  createSubstitute(@Args('createSubstituteInput') createSubstituteInput: CreateSubstituteInput) {
    return this.substituteService.create(createSubstituteInput);
  }

  @Query(() => [Substitute], { name: 'substitute' })
  findAll() {
    return this.substituteService.findAll();
  }

  @Query(() => Substitute, { name: 'substitute' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.substituteService.findOne(id);
  }

  @Mutation(() => Substitute)
  updateSubstitute(@Args('updateSubstituteInput') updateSubstituteInput: UpdateSubstituteInput) {
    return this.substituteService.update(updateSubstituteInput.id, updateSubstituteInput);
  }

  @Mutation(() => Substitute)
  removeSubstitute(@Args('id', { type: () => Int }) id: number) {
    return this.substituteService.remove(id);
  }
}
