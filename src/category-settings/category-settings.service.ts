import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCategorySettingInput } from './dto/create-category-setting.input';
import { UpdateCategorySettingInput } from './dto/update-category-setting.input';
import { CategorySettings } from './entities/category-setting.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryService } from 'src/category/category.service';
import { Credential } from 'src/credentials/entities/credential.entity';

@Injectable()
export class CategorySettingsService {
  constructor(
    @InjectRepository(CategorySettings)
    private categorySettingsRepository: Repository<CategorySettings>,
    private categoryService: CategoryService,
  ) {}

  async create(createCategorySettingInput: CreateCategorySettingInput, user: Credential) {
    const category = await this.categoryService.findOneByName(createCategorySettingInput.category);

    if (!category) {
      throw new HttpException(`Invalid category name`, HttpStatus.BAD_REQUEST);
    }

    // authenticating the user have permission to update the category
    const categoryExists = user.categories?.some(ctrg => ctrg.name === category?.name);

    if (!categoryExists) {
      throw new HttpException(
        `You dont have permission to access the category ${category?.name} `,
        HttpStatus.UNAUTHORIZED,
      );
    }

    const newData = this.categorySettingsRepository.create({
      maxGroup: createCategorySettingInput.maxGroup,
      maxSingle: createCategorySettingInput.maxSingle,
      maxProgram: createCategorySettingInput.maxProgram,
      minGroup: createCategorySettingInput.minGroup,
      minSingle: createCategorySettingInput.minSingle,
      minProgram: createCategorySettingInput.minProgram,
    });

    const savedSettings = await this.categorySettingsRepository.save(newData);

    category.settings = savedSettings;
    const addSettings = await this.categoryService.addSettingsToCategory(category.id, category);

    return savedSettings;
  }

  findAll() {
    try {
      return this.categorySettingsRepository.find({ relations: ['category'] });
    } catch (e) {
      throw new HttpException(
        'An Error have when finding data ',
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: e },
      );
    }
  }

  async findOne(id: number) {
    try {
      // checking is category_settings exist
      const category_settings = await this.categorySettingsRepository.findOne({
        where: { id },
        relations: ['category'],
      });
      if (!category_settings) {
        throw new HttpException(`Invalid category settings id`, HttpStatus.BAD_REQUEST);
      }

      return category_settings;
    } catch (e) {
      throw new HttpException(
        'An Error have when finding data ',
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: e },
      );
    }
  }

  async update(
    id: number,
    updateCategorySettingInput: UpdateCategorySettingInput,
    user: Credential,
  ) {
    // checking is category_settings exist
    const category_settings = await this.categorySettingsRepository.findOneBy({ id });

    if (!category_settings) {
      throw new HttpException(`Invalid category settings id`, HttpStatus.BAD_REQUEST);
    }

    // checking is category exist
    const category = await this.categoryService.findOneByName(updateCategorySettingInput.category);

    if (!category) {
      throw new HttpException(`Invalid category name`, HttpStatus.BAD_REQUEST);
    }

    // authenticating the user have permission to update the category
    const categoryExists = user.categories?.some(ctrg => ctrg.name === category?.name);

    if (!categoryExists) {
      throw new HttpException(
        `You dont have permission to access the category ${category?.name} `,
        HttpStatus.UNAUTHORIZED,
      );
    }

    const newData = this.categorySettingsRepository.create({
      maxGroup: updateCategorySettingInput.maxGroup,
      maxSingle: updateCategorySettingInput.maxSingle,
      maxProgram: updateCategorySettingInput.maxProgram,
      minGroup: updateCategorySettingInput.minGroup,
      minSingle: updateCategorySettingInput.minSingle,
      minProgram: updateCategorySettingInput.minProgram,
    });

    const savedSettings = await this.categorySettingsRepository.update(id, newData);

    category.settings = newData;
    try {
      return this.categoryService.addSettingsToCategory(category.id, category);
    } catch (e) {
      throw new HttpException(
        'An Error have when updating data ',
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: e },
      );
    }
  }

  async remove(id: number, user: Credential) {
    // checking is category_settings exist
    const category_settings = await this.findOne(id);

    // checking is category exist
    const category = await this.categoryService.findOneByName(category_settings.category.name);

    if (!category) {
      throw new HttpException(`Invalid category name`, HttpStatus.BAD_REQUEST);
    }

    // authenticating the user have permission to update the category
    const categoryExists = user.categories?.some(ctrg => ctrg.name === category?.name);

    if (!categoryExists) {
      throw new HttpException(
        `You dont have permission to access the category ${category?.name} `,
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (!category_settings) {
      throw new HttpException(`Invalid category settings id`, HttpStatus.BAD_REQUEST);
    }
    try {
      return this.categorySettingsRepository.delete(id);
    } catch (e) {
      throw new HttpException(
        'An Error have when deleting data ',
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: e },
      );
    }
  }
}
