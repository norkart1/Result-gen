import { Injectable } from '@nestjs/common';
import { CreateSectionInput } from './dto/create-section.input';
import { UpdateSectionInput } from './dto/update-section.input';

@Injectable()
export class SectionsService {
  create(createSectionInput: CreateSectionInput) {
    return 'This action adds a new section';
  }

  findAll() {
    return `This action returns all sections`;
  }

  findOne(id: number) {
    return `This action returns a #${id} section`;
  }

  update(id: number, updateSectionInput: UpdateSectionInput) {
    return `This action updates a #${id} section`;
  }

  remove(id: number) {
    return `This action removes a #${id} section`;
  }
}
