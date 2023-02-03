import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { TeamManagersService } from './team-managers.service';
import { TeamManager } from './entities/team-manager.entity';
import { CreateTeamManagerInput } from './dto/create-team-manager.input';
import { UpdateTeamManagerInput } from './dto/update-team-manager.input';

@Resolver(() => TeamManager)
export class TeamManagersResolver {
  constructor(private readonly teamManagersService: TeamManagersService) {}

  @Mutation(() => TeamManager)
  createTeamManager(@Args('createTeamManagerInput') createTeamManagerInput: CreateTeamManagerInput) {
    return this.teamManagersService.create(createTeamManagerInput);
  }

  @Query(() => [TeamManager], { name: 'teamManagers' })
  findAll() {
    return this.teamManagersService.findAll();
  }

  @Query(() => TeamManager, { name: 'teamManager' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.teamManagersService.findOne(id);
  }

  @Mutation(() => TeamManager)
  updateTeamManager(@Args('updateTeamManagerInput') updateTeamManagerInput: UpdateTeamManagerInput) {
    return this.teamManagersService.update(updateTeamManagerInput.id, updateTeamManagerInput);
  }

  @Mutation(() => TeamManager)
  removeTeamManager(@Args('id', { type: () => Int }) id: number) {
    return this.teamManagersService.remove(id);
  }
}
