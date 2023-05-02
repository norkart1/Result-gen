import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CategorySettingsService } from './category-settings.service';
import { CategorySettings } from './entities/category-setting.entity';
import { CreateCategorySettingInput } from './dto/create-category-setting.input';
import { UpdateCategorySettingInput } from './dto/update-category-setting.input';
import { CategorySettingsModule } from './category-settings.module';

@Resolver(() => CategorySettingsModule)
export class CategorySettingsResolver {
  constructor(private readonly categorySettingsService: CategorySettingsService) {}

  @Mutation(() => CategorySettings)
  createCategorySetting(@Args('createCategorySettingInput') createCategorySettingInput: CreateCategorySettingInput) {
    return this.categorySettingsService.create(createCategorySettingInput);
  }

  @Query(() => [CategorySettings], { name: 'categorySettings' })
  findAll() {
    return this.categorySettingsService.findAll();
  }

  @Query(() => CategorySettings, { name: 'categorySetting' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.categorySettingsService.findOne(id);
  }

  @Mutation(() => CategorySettings)
  updateCategorySetting(@Args('updateCategorySettingInput') updateCategorySettingInput: UpdateCategorySettingInput) {
    return this.categorySettingsService.update(updateCategorySettingInput.id, updateCategorySettingInput);
  }

  @Mutation(() => CategorySettings)
  removeCategorySetting(@Args('id', { type: () => Int }) id: number) {
    return this.categorySettingsService.remove(id);
  }
}
