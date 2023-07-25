import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CustomSettingsService } from './custom-settings.service';
import { CustomSetting } from './entities/custom-setting.entity';
import { CreateCustomSettingInput } from './dto/create-custom-setting.input';
import { UpdateCustomSettingInput } from './dto/update-custom-setting.input';

@Resolver(() => CustomSetting)
export class CustomSettingsResolver {
  constructor(private readonly customSettingsService: CustomSettingsService) {}

  @Mutation(() => CustomSetting)
  createCustomSetting(@Args('createCustomSettingInput') createCustomSettingInput: CreateCustomSettingInput) {
    return this.customSettingsService.create(createCustomSettingInput);
  }

  @Query(() => [CustomSetting], { name: 'customSettings' })
  findAll() {
    return this.customSettingsService.findAll();
  }

  @Query(() => CustomSetting, { name: 'customSetting' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.customSettingsService.findOne(id);
  }

  @Mutation(() => CustomSetting)
  updateCustomSetting(@Args('updateCustomSettingInput') updateCustomSettingInput: UpdateCustomSettingInput) {
    return this.customSettingsService.update(updateCustomSettingInput.id, updateCustomSettingInput);
  }

  @Mutation(() => CustomSetting)
  removeCustomSetting(@Args('id', { type: () => Int }) id: number) {
    return this.customSettingsService.remove(id);
  }
}
