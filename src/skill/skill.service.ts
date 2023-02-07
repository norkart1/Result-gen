import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSkillInput } from './dto/create-skill.input';
import { UpdateSkillInput } from './dto/update-skill.input';
import { Skill } from './entities/skill.entity';

@Injectable()
export class SkillService {

  constructor(@InjectRepository(Skill) private skillRepository:Repository<Skill>) {}


  create(createSkillInput: CreateSkillInput) {
    const newSkillInput = this.skillRepository.create(createSkillInput)
    return this.skillRepository.save(newSkillInput);
  }

  findAll() {
    return this.skillRepository.find();
  }

  findOne(id: number) {
    return this.skillRepository.findOneBy({id})
  }

  update(id: number, updateSkillInput: UpdateSkillInput) {
    return this.skillRepository.update(id, updateSkillInput);
  }

  remove(id: number) {
    return this.skillRepository.delete(id);
  }
}
