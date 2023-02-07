import { ArgumentMetadata, HttpException, HttpStatus, Injectable, PipeTransform } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Candidate } from '../entities/candidate.entity';

@Injectable()
export class CandidatePipe implements PipeTransform {
  constructor(@InjectRepository(Candidate) private Repository: Repository<Candidate>) {

  }
  async transform(value: any, metadata: ArgumentMetadata) {

    let { chestNO } = value
    const user = await this.Repository.findOne({
      where: {
        chestNO,
      },
    })
    if (user) {
      console.log('Candidate already exists');

      throw new HttpException("Candidate already exists", HttpStatus.BAD_REQUEST);

    }

    return value;
  }
}
