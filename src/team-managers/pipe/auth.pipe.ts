import { ArgumentMetadata, HttpException, HttpStatus, Injectable, PipeTransform } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TeamManager } from '../entities/team-manager.entity';

@Injectable()
export class AuthPipe implements PipeTransform {
  constructor(@InjectRepository(TeamManager) private Repository: Repository<TeamManager>) {

  }
  async transform(value: any, metadata: ArgumentMetadata) {

    let { username } = value
    const user = await this.Repository.findOne({
      where: {
        username,
      },
    })
    if (user) {
      console.log('Team manager already exists');

      throw new HttpException("Team Manager already exists", HttpStatus.BAD_REQUEST);

    }

    return value;
  }
}
