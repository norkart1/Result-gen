import { Module } from '@nestjs/common';
import { GradesService } from './grades.service';
import { GradesResolver } from './grades.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Grade } from './entities/grade.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Grade])],
  providers: [GradesResolver, GradesService],
  exports:[GradesService]
})
export class GradesModule {}
