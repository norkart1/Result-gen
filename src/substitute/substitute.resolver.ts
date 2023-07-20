import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { SubstituteService } from './substitute.service';
import { Substitute } from './entities/substitute.entity';
import { CreateSubstituteInput } from './dto/create-substitute.input';
import { UpdateSubstituteInput } from './dto/update-substitute.input';
import { HasRoles, RolesGuard } from 'src/credentials/roles/roles.guard';
import { UseGuards } from '@nestjs/common';
import { Roles } from 'src/credentials/roles/roles.enum';

@Resolver(() => Substitute)
export class SubstituteResolver {
  constructor(private readonly substituteService: SubstituteService) {}

  @Mutation(() => Substitute)
  @HasRoles(Roles.TeamManager)
  @UseGuards(RolesGuard)
  createSubstitute(
    @Args('createSubstituteInput') createSubstituteInput: CreateSubstituteInput,
    @Context('req') req: any,
  ) {
    return this.substituteService.create(createSubstituteInput, req.user);
  }

  @Query(() => [Substitute], { name: 'substitutes' })
  findAll() {
    return this.substituteService.findAll();
  }

  @Query(() => Substitute, { name: 'substitute' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.substituteService.findOne(id);
  }

  @Mutation(() => Substitute)
  @HasRoles(Roles.TeamManager)
  @UseGuards(RolesGuard)
  updateSubstitute(@Args('updateSubstituteInput') updateSubstituteInput: UpdateSubstituteInput ,
  @Context('req') req: any,
  ) {
    return this.substituteService.update(updateSubstituteInput.id, updateSubstituteInput , req.user);
  }

  @Mutation(() => Substitute)
  @HasRoles(Roles.TeamManager)
  @UseGuards(RolesGuard)
  removeSubstitute(@Args('id', { type: () => Int }) id: number ,
  @Context('req') req: any,
  ) {
    return this.substituteService.remove(id, req.user);
  }

  @Mutation(() => Substitute)
  @HasRoles(Roles.Controller)
  @UseGuards(RolesGuard)
  approveSubstitute(@Args('id', { type: () => Int }) id: number ,
  @Context('req') req: any,
  ) {
    return this.substituteService.ApproveSubstitute(id , req.user);
  }

  @Mutation(() => Substitute)
  @HasRoles(Roles.Controller)
  @UseGuards(RolesGuard)
  rejectSubstitute(@Args('id', { type: () => Int }) id: number ,
  @Context('req') req: any,
  ) {
    return this.substituteService.RejectSubstitute(id , req.user);
  }
}
