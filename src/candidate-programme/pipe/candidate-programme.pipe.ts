import { ArgumentMetadata, HttpException, HttpStatus, Injectable, PipeTransform } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CandidateProgramme } from '../entities/candidate-programme.entity';

@Injectable()
export class CandidateProgrammePipe implements PipeTransform {
  constructor(@InjectRepository(CandidateProgramme) private userRepository: Repository<CandidateProgramme>) {

  }
  async transform(value: any, metadata: ArgumentMetadata) {

    let { id } = value
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    })
    if (user) {
      console.log('User already exists');

      throw new HttpException("User already exists", HttpStatus.BAD_REQUEST);

    }

    return value;
  }
}
