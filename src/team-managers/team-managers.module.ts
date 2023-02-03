import { Module } from '@nestjs/common';
import { TeamManagersService } from './team-managers.service';
import { TeamManagersResolver } from './team-managers.resolver';

@Module({
  providers: [TeamManagersResolver, TeamManagersService]
})
export class TeamManagersModule {}
