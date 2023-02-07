import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGradeInput } from './dto/create-grade.input';
import { UpdateGradeInput } from './dto/update-grade.input';
import { Grade } from './entities/grade.entity';

@Injectable()
export class GradesService {

  constructor(@InjectRepository(Grade) private gradeRepository:Repository<Grade>) {}


  create(createGradeInput: CreateGradeInput) {
    const newGradeInput = this.gradeRepository.create(createGradeInput)
    return this.gradeRepository.save(newGradeInput);
  }

  findAll() {
    return this.gradeRepository.find();
  }

  findOne(id: number) {
    return this.gradeRepository.findOneBy({id});
  }

  update(id: number, updateGradeInput: UpdateGradeInput) {
    return this.gradeRepository.update(id, updateGradeInput);
  }

  remove(id: number) {
    return this.gradeRepository.delete(id);
  }
}
