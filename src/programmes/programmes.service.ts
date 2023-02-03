import { Injectable } from '@nestjs/common';
import { CreateProgrammeInput } from './dto/create-programme.input';
import { UpdateProgrammeInput } from './dto/update-programme.input';

@Injectable()
export class ProgrammesService {
  create(createProgrammeInput: CreateProgrammeInput) {
    return 'This action adds a new programme';
  }

  findAll() {
    return `This action returns all programmes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} programme`;
  }

  update(id: number, updateProgrammeInput: UpdateProgrammeInput) {
    return `This action updates a #${id} programme`;
  }

  remove(id: number) {
    return `This action removes a #${id} programme`;
  }
}
