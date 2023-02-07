import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSectionInput } from './dto/create-section.input';
import { UpdateSectionInput } from './dto/update-section.input';
import { Section } from './entities/section.entity';

@Injectable()
export class SectionsService {

  constructor(@InjectRepository(Section) private sectionRepository:Repository<Section>) {}


  create(createSectionInput: CreateSectionInput) {
    const newSectionInput = this.sectionRepository.create(createSectionInput)
    return  this.sectionRepository.save(newSectionInput)
  }

  findAll() {
    return this.sectionRepository.find();
  }

  findOne(id: number) {
    return this.sectionRepository.findOneBy({id})
  }

  update(id: number, updateSectionInput: UpdateSectionInput) {
    return this.sectionRepository.update(id, updateSectionInput);
  }

  remove(id: number) {
    return this.sectionRepository.delete(id);
  }
}
