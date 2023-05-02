import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePositionInput } from './dto/create-position.input';
import { UpdatePositionInput } from './dto/update-position.input';
import { Position } from './entities/position.entity';

@Injectable()
export class PositionService {

  constructor(@InjectRepository(Position) private positionRepository: Repository<Position>) { }



  create(createPositionInput: CreatePositionInput) {
    try {
      const newPositionInput = this.positionRepository.create(createPositionInput)
      return this.positionRepository.save(newPositionInput);
    } catch (e) {
      throw new HttpException("An Error have when inserting data ", HttpStatus.INTERNAL_SERVER_ERROR, { cause: e })
    }

  }

  findAll() {
    try {

      return this.positionRepository.find({ relations: ['candidateProgramme', 'candidateProgramme.candidate', 'candidateProgramme.programme'] });
    } catch (e) {
      throw new HttpException("An Error have when finding data ", HttpStatus.INTERNAL_SERVER_ERROR, { cause: e })
    }
  }

  async findOne(id: number) {
    // checking is position exist
    const position = await this.positionRepository.findOne({
      where: { id },
      relations: ['candidateProgramme', 'candidateProgramme.candidate', 'candidateProgramme.programme']
    })

    if (!position) {
      throw new HttpException(`Cant find a position `, HttpStatus.BAD_REQUEST)
    }
    // trying to return data

    try {
      return this.positionRepository.findOneBy({ id });

    } catch (e) {
      throw new HttpException("An Error have when finding data ", HttpStatus.INTERNAL_SERVER_ERROR, { cause: e })
    }

  }

  async update(id: number, updatePositionInput: UpdatePositionInput) {
    // checking is position exist
    const position = await this.positionRepository.findOneBy({ id })

    if (!position) {
      throw new HttpException(`Cant find a position `, HttpStatus.BAD_REQUEST)
    }
    // trying to return data

    try {
      return this.positionRepository.update(id, updatePositionInput);
    } catch (e) {
      throw new HttpException("An Error have when updating data ", HttpStatus.INTERNAL_SERVER_ERROR, { cause: e })
    }


  }

  async remove(id: number) {// checking is position exist
    const position = await this.positionRepository.findOneBy({ id })

    if (!position) {
      throw new HttpException(`Cant find a position `, HttpStatus.BAD_REQUEST)
    }
    // trying to return data

    try {
      return this.positionRepository.delete(id);
    } catch (e) {
      throw new HttpException("An Error have when deleting data ", HttpStatus.INTERNAL_SERVER_ERROR, { cause: e })
    }

  }
}
