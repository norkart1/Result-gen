import { ArgumentMetadata, HttpException, HttpStatus, Injectable, PipeTransform } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Controller } from '../entities/controller.entity';

@Injectable()
export class AuthPipe implements PipeTransform {
  constructor(@InjectRepository(Controller) private Repository: Repository<Controller>) {

  }
  async transform(value: any, metadata: ArgumentMetadata) {

    let { username } = value
    const user = await this.Repository.findOne({
      where: {
        username,
      },
    })
    if (user) {
      console.log('controller already exists');

      throw new HttpException("controller already exists", HttpStatus.BAD_REQUEST);

    }

    return value;
  }
}
