import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ProgrammesService } from './programmes.service';
import { Programme } from './entities/programme.entity';
import { CreateProgrammeInput } from './dto/create-programme.input';
import { UpdateProgrammeInput } from './dto/update-programme.input';

@Resolver(() => Programme)
export class ProgrammesResolver {
  constructor(private readonly programmesService: ProgrammesService) {}

  @Mutation(() => Programme)
  createProgramme(@Args('createProgrammeInput') createProgrammeInput: CreateProgrammeInput) {
    return this.programmesService.create(createProgrammeInput);
  }

  @Query(() => [Programme], { name: 'programmes' })
  findAll() {
    return this.programmesService.findAll();
  }

  @Query(() => Programme, { name: 'programme' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.programmesService.findOne(id);
  }

  @Mutation(() => Programme)
  updateProgramme(@Args('updateProgrammeInput') updateProgrammeInput: UpdateProgrammeInput) {
    return this.programmesService.update(updateProgrammeInput.id, updateProgrammeInput);
  }

  @Mutation(() => Programme)
  removeProgramme(@Args('id', { type: () => Int }) id: number) {
    return this.programmesService.remove(id);
  }
}
