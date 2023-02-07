import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePositionInput } from './dto/create-position.input';
import { UpdatePositionInput } from './dto/update-position.input';
import { Position } from './entities/position.entity';

@Injectable()
export class PositionService {

  constructor(@InjectRepository(Position) private positionRepository:Repository<Position>) {}



  create(createPositionInput: CreatePositionInput) {
    const newPositionInput = this.positionRepository.create(createPositionInput)
    return this.positionRepository.save(newPositionInput);
  }

  findAll() {
    return  this.positionRepository.find();
  }

  findOne(id: number) {
    return this.positionRepository.findOneBy({id});
  }

  update(id: number, updatePositionInput: UpdatePositionInput) {
    return this.positionRepository.update(id, updatePositionInput);
  }

  remove(id: number) {
    return this.positionRepository.delete(id);
  }
}
