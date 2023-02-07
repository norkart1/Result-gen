import { Module } from '@nestjs/common';
import { TeamManagersService } from './team-managers.service';
import { TeamManagersResolver } from './team-managers.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamManager } from './entities/team-manager.entity';

@Module({
  imports:[TypeOrmModule.forFeature([TeamManager])],
  providers: [TeamManagersResolver, TeamManagersService]
})
export class TeamManagersModule {}
