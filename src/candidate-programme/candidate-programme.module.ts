import { Module } from '@nestjs/common';
import { CandidateProgrammeService } from './candidate-programme.service';
import { CandidateProgrammeResolver } from './candidate-programme.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CandidateProgramme } from './entities/candidate-programme.entity';
import { CandidatesModule } from 'src/candidates/candidates.module';
import { ProgrammesModule } from 'src/programmes/programmes.module';
import { CategoryModule } from 'src/category/category.module';
import { GradesModule } from 'src/grades/grades.module';
import { PositionModule } from 'src/position/position.module';

@Module({
  imports:[TypeOrmModule.forFeature([CandidateProgramme]), CandidatesModule , ProgrammesModule , CategoryModule,GradesModule , PositionModule],
  providers: [CandidateProgrammeResolver, CandidateProgrammeService]
})
export class CandidateProgrammeModule {}
