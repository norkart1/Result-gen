import { Module } from '@nestjs/common';
import { CustomSettingsService } from './custom-settings.service';
import { CustomSettingsResolver } from './custom-settings.resolver';
import { CustomSetting } from './entities/custom-setting.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([CustomSetting])],
  providers: [CustomSettingsResolver, CustomSettingsService]
})
export class CustomSettingsModule {}
