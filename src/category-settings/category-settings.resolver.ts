import { Resolver, Query, Mutation, Args, Int, Context, Info } from '@nestjs/graphql';
import { CategorySettingsService } from './category-settings.service';
import { CategorySettings } from './entities/category-setting.entity';
import { CreateCategorySettingInput } from './dto/create-category-setting.input';
import { UpdateCategorySettingInput } from './dto/update-category-setting.input';
import { CategorySettingsModule } from './category-settings.module';
import { HasRoles, RolesGuard } from 'src/credentials/roles/roles.guard';
import { UseGuards } from '@nestjs/common';
import { Roles } from 'src/credentials/roles/roles.enum';
import { fieldsProjection } from 'graphql-fields-list';

@Resolver(() => CategorySettingsModule)
export class CategorySettingsResolver {
  constructor(private readonly categorySettingsService: CategorySettingsService) {}

  @HasRoles(Roles.Controller)
  @UseGuards(RolesGuard)
  @Mutation(() => CategorySettings)
  createCategorySetting(
    @Args('createCategorySettingInput') createCategorySettingInput: CreateCategorySettingInput,
    @Context('req') req: any,
  ) {
    return this.categorySettingsService.create(createCategorySettingInput, req.user);
  }

  @Query(() => [CategorySettings], { name: 'categorySettings' })
  findAll(@Info() info: any) {
    const fields = Object.keys(fieldsProjection(info));
    return this.categorySettingsService.findAll(fields);
  }

  @Query(() => CategorySettings, { name: 'categorySetting' })
  findOne(@Args('id', { type: () => Int }) id: number, @Info() info: any) {
    const fields = Object.keys(fieldsProjection(info));
    return this.categorySettingsService.findOne(id, fields);
  }

  @Mutation(() => CategorySettings)
  @HasRoles(Roles.Controller)
  @UseGuards(RolesGuard)
  updateCategorySetting(
    @Args('updateCategorySettingInput') updateCategorySettingInput: UpdateCategorySettingInput,
    @Context('req') req: any,
  ) {
    return this.categorySettingsService.update(
      updateCategorySettingInput.id,
      updateCategorySettingInput,
      req.user,
    );
  }

  @Mutation(() => CategorySettings)
  @HasRoles(Roles.Controller)
  @UseGuards(RolesGuard)
  removeCategorySetting(@Args('id', { type: () => Int }) id: number, @Context('req') req: any) {
    return this.categorySettingsService.remove(id, req.user);
  }
}
