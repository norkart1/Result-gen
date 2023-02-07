import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProgrammeInput } from './dto/create-programme.input';
import { UpdateProgrammeInput } from './dto/update-programme.input';
import { Programme } from './entities/programme.entity';

@Injectable()
export class ProgrammesService {
  constructor(@InjectRepository(Programme) private programmeRepository:Repository<Programme>) {}

  create(createProgrammeInput: CreateProgrammeInput) {
    const newProgrammeInput = this.programmeRepository.create(createProgrammeInput)
    return  this.programmeRepository.save(newProgrammeInput);
  }

  findAll() {
    return this.programmeRepository.find()
  }

  findOne(id: number) {
    return this.programmeRepository.findOneBy({id})
  }

  update(id: number, updateProgrammeInput: UpdateProgrammeInput) {
    return this.programmeRepository.update(id,updateProgrammeInput)
  }

  remove(id: number) {
    return this.programmeRepository.delete(id)
  }
}
