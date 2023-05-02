import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
    try{
      return  this.controllerRepository.find({relations:['categories']});
      }catch (e) {
        throw new HttpException("An Error have when finding data ", HttpStatus.INTERNAL_SERVER_ERROR, {  cause: e } )
      }
  }


  async findOne(id: number) {
    // trying to find data
    try{
      const controller : Controller = await this.controllerRepository.findOne({
        where:{id},
        relations:['categories']
      });
      // checking is controller exist
      if(!controller){
        throw new HttpException(`Cant find a controller to delete`, HttpStatus.BAD_REQUEST)
      }
      // returning controller
      return controller;
      // if any error throwing
      }catch (e) {
        throw new HttpException("An Error have when finding data ", HttpStatus.INTERNAL_SERVER_ERROR, {  cause: e } )
      }
     
  }

 async update(id: number, updateControllerInput: UpdateControllerInput) {
    
  // checking is controller exist
  const controller = await this.controllerRepository.findOneBy({id})

  if (!controller) {
    throw new HttpException(`Cant find a controller to delete`, HttpStatus.BAD_REQUEST)
  }

  try{
    return this.controllerRepository.update(id, updateControllerInput);

    }catch (e) {
      throw new HttpException("An Error have when updating data ", HttpStatus.INTERNAL_SERVER_ERROR, {  cause: e } )
    }
  }

 async remove(id: number) {

  // checking is controller exist
    const controller = await this.controllerRepository.findOneBy({id})

    if (!controller) {
      throw new HttpException(`Cant find a controller to delete`, HttpStatus.BAD_REQUEST)
    }
    // trying to delete data

    try{
    return this.controllerRepository.delete(id);
    }catch (e) {
      throw new HttpException("An Error have when deleting data ", HttpStatus.INTERNAL_SERVER_ERROR, {  cause: e } )
    }
  }
}
