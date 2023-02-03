import { Module } from '@nestjs/common';
import { CandidatesService } from './candidates.service';
import { CandidatesResolver } from './candidates.resolver';

@Module({
  providers: [CandidatesResolver, CandidatesService]
})
export class CandidatesModule {}
