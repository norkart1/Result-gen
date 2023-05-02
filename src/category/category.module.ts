import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryResolver } from './category.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { SectionsModule } from 'src/sections/sections.module';

@Module({
  imports:[ TypeOrmModule.forFeature([Category]) , SectionsModule],
  providers: [CategoryResolver, CategoryService],
  exports:[CategoryService]
})
export class CategoryModule {}
