import { Module } from '@nestjs/common';
import { SectionsService } from './sections.service';
import { SectionsResolver } from './sections.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Section } from './entities/section.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Section])],
  providers: [SectionsResolver, SectionsService],
  exports:[SectionsService]
})
export class SectionsModule {}
