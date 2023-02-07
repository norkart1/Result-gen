import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCandidateProgrammeInput } from './dto/create-candidate-programme.input';
import { UpdateCandidateProgrammeInput } from './dto/update-candidate-programme.input';
import { CandidateProgramme } from './entities/candidate-programme.entity';

@Injectable()
export class CandidateProgrammeService {


  constructor(@InjectRepository(CandidateProgramme) private candidateProgrammeRepository:Repository<CandidateProgramme>) {}


   create(createCandidateProgrammeInput: CreateCandidateProgrammeInput) {
    const newCreateCandidateProgrammeInput =this.candidateProgrammeRepository.create()
    return  this.candidateProgrammeRepository.save(newCreateCandidateProgrammeInput);
  }

  findAll() {
    return `This action returns all candidateProgramme`;
  }

  findOne(id: number) {
    return `This action returns a #${id} candidateProgramme`;
  }

  update(id: number, updateCandidateProgrammeInput: UpdateCandidateProgrammeInput) {
    return `This action updates a #${id} candidateProgramme`;
  }

  remove(id: number) {
    return `This action removes a #${id} candidateProgramme`;
  }
}
