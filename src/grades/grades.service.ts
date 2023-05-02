import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGradeInput } from './dto/create-grade.input';
import { UpdateGradeInput } from './dto/update-grade.input';
import { Grade } from './entities/grade.entity';

@Injectable()
export class GradesService {

  constructor(@InjectRepository(Grade) private gradeRepository: Repository<Grade>) { }


  create(createGradeInput: CreateGradeInput) {
    try {
      const newGradeInput = this.gradeRepository.create(createGradeInput)
      return this.gradeRepository.save(newGradeInput);
    } catch (e) {
      throw new HttpException("An Error have when inserting data ", HttpStatus.INTERNAL_SERVER_ERROR, { cause: e })
    }

  }

  findAll() {
    try {

      return this.gradeRepository.find({ relations: ['candidateProgramme', 'candidateProgramme.candidate', 'candidateProgramme.programme'] });
    } catch (e) {
      throw new HttpException("An Error have when finding data ", HttpStatus.INTERNAL_SERVER_ERROR, { cause: e })
    }
  }

  async findOne(id: number) {

    try {

      // checking is grade exist
      const grade = await this.gradeRepository.findOne({
        where: { id },
        relations: ['candidateProgramme', 'candidateProgramme.candidate', 'candidateProgramme.programme']
      });

      if (!grade) {
        throw new HttpException(`Cant find a grade `, HttpStatus.BAD_REQUEST)
      }
      // trying to return data

      return grade

    } catch (e) {
      throw new HttpException("An Error have when finding data ", HttpStatus.INTERNAL_SERVER_ERROR, { cause: e })
    }


  }

  async update(id: number, updateGradeInput: UpdateGradeInput) {
    // checking is grade exist
    const grade = await this.gradeRepository.findOneBy({ id })

    if (!grade) {
      throw new HttpException(`Cant find a grade `, HttpStatus.BAD_REQUEST)
    }
    // trying to return data

    try {
       this.gradeRepository.update(id, updateGradeInput);
       return grade;
    } catch (e) {
      throw new HttpException("An Error have when updating data ", HttpStatus.INTERNAL_SERVER_ERROR, { cause: e })
    }

  }

  async remove(id: number) {
    const grade = await this.gradeRepository.findOneBy({ id })

    if (!grade) {
      throw new HttpException(`Cant find a grade to delete`, HttpStatus.BAD_REQUEST)
    }
    // trying to delete data

    try {
      return this.gradeRepository.delete(id);
    } catch (e) {
      throw new HttpException("An Error have when deleting data ", HttpStatus.INTERNAL_SERVER_ERROR, { cause: e })
    }
  }
}
