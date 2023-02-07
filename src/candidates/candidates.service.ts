import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCandidateInput } from './dto/create-candidate.input';
import { UpdateCandidateInput } from './dto/update-candidate.input';
import { Candidate } from './entities/candidate.entity';

@Injectable()
export class CandidatesService {

  constructor(@InjectRepository(Candidate) private candidateRepository:Repository<Candidate>) {}

  create(createCandidateInput: CreateCandidateInput) {
    const newCandidateInput = this.candidateRepository.create(createCandidateInput)
    return  this.candidateRepository.save(newCandidateInput)
  }

  findAll() {
    return this.candidateRepository.find();
  }

  findOne(id: number) {
    return this.candidateRepository.findOneBy({id});
  }

  update(id: number, updateCandidateInput: UpdateCandidateInput) {
    return this.candidateRepository.update(id, updateCandidateInput);
  }

  remove(id: number) {
    return this.candidateRepository.delete(id);
  }
}
