import { Module } from '@nestjs/common';
import { CandidatesService } from './candidates.service';
import { CandidatesResolver } from './candidates.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Candidate } from './entities/candidate.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Candidate])],
  providers: [CandidatesResolver, CandidatesService]
})
export class CandidatesModule {}
