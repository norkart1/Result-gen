import { Module } from '@nestjs/common';
import { CategorySettingsService } from './category-settings.service';
import { CategorySettingsResolver } from './category-settings.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategorySettings } from './entities/category-setting.entity';
import { CategoryModule } from 'src/category/category.module';

@Module({
  imports:[TypeOrmModule.forFeature([CategorySettings]), CategoryModule],
  providers: [CategorySettingsResolver, CategorySettingsService],
  exports:[CategorySettingsService]
})
export class CategorySettingsModule {

}
