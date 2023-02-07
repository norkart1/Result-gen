import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDetailInput } from './dto/create-detail.input';
import { UpdateDetailInput } from './dto/update-detail.input';
import { Detail } from './entities/detail.entity';

@Injectable()
export class DetailsService {

  constructor(@InjectRepository(Detail) private detailRepository:Repository<Detail>) {}


  create(createDetailInput: CreateDetailInput) {
    const newDetailInput = this.detailRepository.create(createDetailInput)
    return  this.detailRepository.save(newDetailInput)
  }

  findAll() {
    return this.detailRepository.find();
  }

  findOne(id: number) {
    return this.detailRepository.findOneBy({id})
  }

  update(id: number, updateDetailInput: UpdateDetailInput) {
    return this.detailRepository.update(id, updateDetailInput);
  }

  remove(id: number) {
    return this.detailRepository.delete(id);
  }
}
