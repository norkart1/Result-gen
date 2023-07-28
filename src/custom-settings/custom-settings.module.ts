import { Module } from '@nestjs/common';
import { CustomSettingsService } from './custom-settings.service';
import { CustomSettingsResolver } from './custom-settings.resolver';
import { CustomSetting } from './entities/custom-setting.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProgrammesModule } from 'src/programmes/programmes.module';
import { CategoryModule } from 'src/category/category.module';

@Module({
  imports: [TypeOrmModule.forFeature([CustomSetting]) , ProgrammesModule , CategoryModule],
  providers: [CustomSettingsResolver, CustomSettingsService],
  exports : [CustomSettingsService],
})
export class CustomSettingsModule {}
