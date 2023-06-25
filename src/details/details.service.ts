import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDetailInput } from './dto/create-detail.input';
import { UpdateDetailInput } from './dto/update-detail.input';
import { Detail } from './entities/detail.entity';

@Injectable()
export class DetailsService {
  constructor(@InjectRepository(Detail) private detailRepository: Repository<Detail>) {}

  async create(createDetailInput: CreateDetailInput) {
    // it can have only one row

    // check how many row are there currently
    const count: number = await this.detailRepository.count();
    if (count > 1) {
      // if there is already a row, update it
      return this.detailRepository.update(1, createDetailInput);
    }

    // create a new row
    try {
      const newDetailInput = this.detailRepository.create(createDetailInput);
      return this.detailRepository.save(newDetailInput);
    } catch (e) {
      throw new HttpException(
        'An Error have when inserting data ',
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: e },
      );
    }
  }

  findAll() {
    try {
      return this.detailRepository.find();
    } catch (e) {
      throw new HttpException(
        'An Error have when finding data ',
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: e },
      );
    }
  }

  findIt() {
    try {
      return this.detailRepository.findOneBy({ id: 1 });
    } catch (e) {
      throw new HttpException(
        'An Error have when finding data ',
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: e },
      );
    }
  }

  update(id: number = 1, updateDetailInput: UpdateDetailInput) {
    try {
      return this.detailRepository.update(id, updateDetailInput);
    } catch (e) {
      throw new HttpException(
        'An Error have when updating data ',
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: e },
      );
    }
  }

  async ReadyToResult() {
    try {
      const detail = await this.detailRepository.findOneBy({ id: 1 });

      if (detail) {
        return new HttpException(
          'An Error have when finding data ',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      detail.isResultReady = true;

      return this.detailRepository.save(detail);
    } catch (e) {
      throw new HttpException(
        'An Error have when finding data ',
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: e },
      );
    }
  }
}
