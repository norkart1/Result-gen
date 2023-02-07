import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateControllerInput } from './dto/create-controller.input';
import { UpdateControllerInput } from './dto/update-controller.input';
import { Controller } from './entities/controller.entity';

@Injectable()
export class ControllersService {

  constructor(@InjectRepository(Controller) private controllerRepository:Repository<Controller>) {}

  create(createControllerInput: CreateControllerInput) {
    const newControllerInput = this.controllerRepository.create(createControllerInput)
    return this.controllerRepository.save(newControllerInput);
  }

  findAll() {
    return  this.controllerRepository.find();
  }

  findOne(id: number) {
    return this.controllerRepository.findOneBy({id});
  }

  update(id: number, updateControllerInput: UpdateControllerInput) {
    return this.controllerRepository.update(id, updateControllerInput);
  }

  remove(id: number) {
    return this.controllerRepository.delete(id);
  }
}
