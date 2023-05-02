import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMediaInput } from './dto/create-media.input';
import { UpdateMediaInput } from './dto/update-media.input';
import { Media } from './entities/media.entity';

@Injectable()
export class MediaService {

  constructor(@InjectRepository(Media) private mediaRepository: Repository<Media>) { }

  create(createMediaInput: CreateMediaInput) {
    try {
      const newMediaInput = this.mediaRepository.create(createMediaInput)
      return this.mediaRepository.save(newMediaInput);
    } catch (e) {
      throw new HttpException("An Error have when inserting data ", HttpStatus.INTERNAL_SERVER_ERROR, { cause: e })
    }

  }

  findAll() {
    try {
      return this.mediaRepository.find();
    } catch (e) {
      throw new HttpException("An Error have when finding data ", HttpStatus.INTERNAL_SERVER_ERROR, { cause: e })
    }

  }

  async findOne(id: number) {
    // checking is media exist
    const media = await this.mediaRepository.findOneBy({ id })

    if (!media) {
      throw new HttpException(`Cant find a media `, HttpStatus.BAD_REQUEST)
    }
    // trying to return data

    try {
      return this.mediaRepository.findOneBy({ id });
    } catch (e) {
      throw new HttpException("An Error have when finding data ", HttpStatus.INTERNAL_SERVER_ERROR, { cause: e })
    }
  }

  async update(id: number, updateMediaInput: UpdateMediaInput) {
    // checking is media exist
    const media = await this.mediaRepository.findOneBy({ id })

    if (!media) {
      throw new HttpException(`Cant find a media `, HttpStatus.BAD_REQUEST)
    }
    // trying to return data

    try {
      return this.mediaRepository.update(id, updateMediaInput);
    } catch (e) {
      throw new HttpException("An Error have when updating data ", HttpStatus.INTERNAL_SERVER_ERROR, { cause: e })
    }
  }

  async remove(id: number) {
    // checking is media exist
    const media = await this.mediaRepository.findOneBy({ id })

    if (!media) {
      throw new HttpException(`Cant find a media `, HttpStatus.BAD_REQUEST)
    }
    // trying to return data

    try {
      return this.mediaRepository.delete(id);
    } catch (e) {
      throw new HttpException("An Error have when deleting data ", HttpStatus.INTERNAL_SERVER_ERROR, { cause: e })
    }

  }
}
