import { Module, forwardRef } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { TeamsResolver } from './teams.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Team } from './entities/team.entity';
import { CredentialsModule } from 'src/credentials/credentials.module';

@Module({
  imports: [TypeOrmModule.forFeature([Team]), forwardRef(() => CredentialsModule)],
  providers: [TeamsResolver, TeamsService],
  exports: [TeamsService],
})
export class TeamsModule {}
