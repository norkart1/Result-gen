import { Injectable } from '@nestjs/common';
import { CreateCustomSettingInput } from './dto/create-custom-setting.input';
import { UpdateCustomSettingInput } from './dto/update-custom-setting.input';
import { CustomSetting } from './entities/custom-setting.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CustomSettingsService {

  constructor(
    @InjectRepository(CustomSetting)
    private customSettingRepository: Repository<CustomSetting>,
  ) {}

  create(createCustomSettingInput: CreateCustomSettingInput) {
    return 'This action adds a new customSetting';
  }

  findAll() {
    return `This action returns all customSettings`;
  }

  findOne(id: number) {
    return `This action returns a #${id} customSetting`;
  }

  update(id: number, updateCustomSettingInput: UpdateCustomSettingInput) {
    return `This action updates a #${id} customSetting`;
  }

  remove(id: number) {
    return `This action removes a #${id} customSetting`;
  }
}
