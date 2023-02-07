import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMediaInput } from './dto/create-media.input';
import { UpdateMediaInput } from './dto/update-media.input';
import { Media } from './entities/media.entity';

@Injectable()
export class MediaService {

  constructor(@InjectRepository(Media) private mediaRepository:Repository<Media>) {}

  create(createMediaInput: CreateMediaInput) {
    const newMediaInput = this.mediaRepository.create(createMediaInput)
    return this.mediaRepository.save(newMediaInput);
  }

  findAll() {
    return this.mediaRepository.find();
  }

  findOne(id: number) {
    return this.mediaRepository.findOneBy({id});
  }

  update(id: number, updateMediaInput: UpdateMediaInput) {
    return this.mediaRepository.update(id, updateMediaInput);
  }

  remove(id: number) {
    return this.mediaRepository.delete(id);
  }
}
