import { ArgumentMetadata, HttpException, HttpStatus, Injectable, PipeTransform } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Media } from '../entities/media.entity';

@Injectable()
export class AuthPipe implements PipeTransform {
  constructor(@InjectRepository(Media) private Repository: Repository<Media>) {

  }
  async transform(value: any, metadata: ArgumentMetadata) {

    let { username } = value
    const user = await this.Repository.findOne({
      where: {
        username,
      },
    })
    if (user) {
      console.log('Media Manager already exists');

      throw new HttpException("Media Manager already exists", HttpStatus.BAD_REQUEST);

    }

    return value;
  }
}
