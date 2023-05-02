import { Module } from '@nestjs/common';
import { ProgrammesService } from './programmes.service';
import { ProgrammesResolver } from './programmes.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Programme } from './entities/programme.entity';
import { ProgrammesController } from './programmes.controller';
import { SkillModule } from 'src/skill/skill.module';
import { SectionsModule } from 'src/sections/sections.module';
import { CategoryModule } from 'src/category/category.module';

@Module({
  imports:[TypeOrmModule.forFeature([Programme]),SkillModule , SectionsModule , CategoryModule],
  providers: [ProgrammesResolver, ProgrammesService],
  controllers: [ProgrammesController],
  exports:[ProgrammesService]
})
export class ProgrammesModule {}
