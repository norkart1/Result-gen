import { Injectable } from '@nestjs/common';
import { CreateSubstituteInput } from './dto/create-substitute.input';
import { UpdateSubstituteInput } from './dto/update-substitute.input';

@Injectable()
export class SubstituteService {
  create(createSubstituteInput: CreateSubstituteInput) {
    return 'This action adds a new substitute';
  }

  findAll() {
    return `This action returns all substitute`;
  }

  findOne(id: number) {
    return `This action returns a #${id} substitute`;
  }

  update(id: number, updateSubstituteInput: UpdateSubstituteInput) {
    return `This action updates a #${id} substitute`;
  }

  remove(id: number) {
    return `This action removes a #${id} substitute`;
  }
}
