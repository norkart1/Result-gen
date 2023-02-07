import { Module } from '@nestjs/common';
import { CandidateProgrammeService } from './candidate-programme.service';
import { CandidateProgrammeResolver } from './candidate-programme.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CandidateProgramme } from './entities/candidate-programme.entity';

@Module({
  imports:[TypeOrmModule.forFeature([CandidateProgramme])],
  providers: [CandidateProgrammeResolver, CandidateProgrammeService]
})
export class CandidateProgrammeModule {}
