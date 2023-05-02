import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSkillInput } from './dto/create-skill.input';
import { UpdateSkillInput } from './dto/update-skill.input';
import { Skill } from './entities/skill.entity';

@Injectable()
export class SkillService {

  constructor(@InjectRepository(Skill) private skillRepository: Repository<Skill>) { }


  create(createSkillInput: CreateSkillInput) {
    const newSkillInput = this.skillRepository.create(createSkillInput)
    return this.skillRepository.save(newSkillInput);
  }

  findAll() {
    try{

      return this.skillRepository.find({ relations: ['programmes'] });
    }catch(e){
      throw new HttpException("An Error have when finding data ", HttpStatus.INTERNAL_SERVER_ERROR, { cause: e })
    }
  }

  findOneByName(name: string) {
    if (!name) {
      throw new  HttpException(`skill cannot be undefined`, HttpStatus.BAD_REQUEST)
    }
    try{
      const skill = this.skillRepository.findOne({
        where: { name },
        relations: ['programmes','programmes.category','programmes.section']
      })

      if(!skill){
        throw new HttpException(`Cant find skill with skill id ${name} `, HttpStatus.BAD_REQUEST)
      }

      return skill
    }catch(e){
      throw new HttpException("An Error have when finding data ", HttpStatus.INTERNAL_SERVER_ERROR, { cause: e })
    }
  }

  findOne(id: number) {
    if (!id) {
      throw new  HttpException(`skill cannot be undefined`, HttpStatus.BAD_REQUEST)
    }
    try{
      const skill = this.skillRepository.findOne({
        where: { id },
        relations: ['programmes','programmes.category','programmes.section']
      })

      if(!skill){
        throw new HttpException(`Cant find skill with skill id ${id} `, HttpStatus.BAD_REQUEST)
      }

      return skill
    }catch(e){
      throw new HttpException("An Error have when finding data ", HttpStatus.INTERNAL_SERVER_ERROR, { cause: e })
    }
     
  }

  update(id: number, updateSkillInput: UpdateSkillInput) {
    
    const skill = this.skillRepository.findOneBy({id})

    if(!skill){
      throw new HttpException(`Cant find a skill `, HttpStatus.BAD_REQUEST)
    }
    // trying to return data  

    try {
      return this.skillRepository.update(id, updateSkillInput);
    } catch (e) {
      throw new HttpException("An Error have when updating data ", HttpStatus.INTERNAL_SERVER_ERROR, { cause: e })
    }

   
  }

  remove(id: number) {

    const skill = this.skillRepository.findOneBy({id})

    if(!skill){
      throw new HttpException(`Cant find a skill `, HttpStatus.BAD_REQUEST)
    }
    // trying to return data

    try {
    return this.skillRepository.delete(id);
    }
    catch (e) {
      throw new HttpException("An Error have when deleting data ", HttpStatus.INTERNAL_SERVER_ERROR, { cause: e })
    }
  }
}
