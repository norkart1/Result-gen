import { Injectable } from '@nestjs/common';
import { CreateGradeInput } from './dto/create-grade.input';
import { UpdateGradeInput } from './dto/update-grade.input';

@Injectable()
export class GradesService {
  create(createGradeInput: CreateGradeInput) {
    return 'This action adds a new grade';
  }

  findAll() {
    return `This action returns all grades`;
  }

  findOne(id: number) {
    return `This action returns a #${id} grade`;
  }

  update(id: number, updateGradeInput: UpdateGradeInput) {
    return `This action updates a #${id} grade`;
  }

  remove(id: number) {
    return `This action removes a #${id} grade`;
  }
}
