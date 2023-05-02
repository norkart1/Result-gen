import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTeamInput } from './dto/create-team.input';
import { UpdateTeamInput } from './dto/update-team.input';
import { Team } from './entities/team.entity';

@Injectable()
export class TeamsService {

  constructor(@InjectRepository(Team) private teamRepository: Repository<Team>) { }


  create(createTeamInput: CreateTeamInput) {
    try {
      const newTeamInput = this.teamRepository.create(createTeamInput)
      return this.teamRepository.save(newTeamInput);
    } catch (e) {
      throw new HttpException("An Error have when inserting data ", HttpStatus.INTERNAL_SERVER_ERROR, { cause: e })
    }

  }

  findAll() {
    try {

      return this.teamRepository.find({ relations: ['manager', 'candidates', 'candidates.team', 'candidates.candidateProgrammes', 'candidates.category', 'candidates.section'] });
    } catch (e) {
      throw new HttpException("An Error have when finding data ", HttpStatus.INTERNAL_SERVER_ERROR, { cause: e })
    }
  }

  findOne(id: number) {
    if (!id) {
      throw new  HttpException(`team cannot be undefined`, HttpStatus.BAD_REQUEST)
    }
    try {
      const team = this.teamRepository.findOneOrFail({
        where: {
          id
        }
        ,
        relations: ['manager', 'candidates', 'candidates.team', 'candidates.candidateProgrammes', 'candidates.category', 'candidates.section']
      });

     
      if (!team) {
        throw new HttpException(`cant find team with id ${id}`, HttpStatus.BAD_REQUEST)
      }
      return team
    } catch (e) {
      throw new HttpException("An Error have when finding data ", HttpStatus.INTERNAL_SERVER_ERROR, { cause: e })
    }


  }

  findOneByName(name: string) {
    if (!name) {
      throw new  HttpException(`team cannot be undefined`, HttpStatus.BAD_REQUEST)
    }
    try {
      const team = this.teamRepository.findOneOrFail({
        where: {
          name
        }
        ,
        relations: ['manager', 'candidates', 'candidates.team', 'candidates.candidateProgrammes', 'candidates.category', 'candidates.section']
      });

      if (!team) {
        throw new HttpException(`cant find team with id ${name}`, HttpStatus.BAD_REQUEST)
      }
      return team
    } catch (e) {
      throw new HttpException("An Error have when finding data ", HttpStatus.INTERNAL_SERVER_ERROR, { cause: e })
    }

  }

  async update(id: number, updateTeamInput: UpdateTeamInput) {
    const team = await this.teamRepository.findOneBy({ id });

    if (!team) {
      throw new HttpException(`cant find team with id ${id}`, HttpStatus.BAD_REQUEST)
    }
    try {

      return this.teamRepository.update(id, updateTeamInput);
    } catch (e) {
      throw new HttpException("An Error have when updating data ", HttpStatus.INTERNAL_SERVER_ERROR, { cause: e })
    }
  }

  async remove(id: number) {
    const team = await this.teamRepository.findOneBy({ id });

    if (!team) {
      throw new HttpException(`cant find team with id ${id}`, HttpStatus.BAD_REQUEST)
    }
    try {
      return this.teamRepository.delete(id);
    } catch (e) {
      throw new HttpException("An Error have when deleting data ", HttpStatus.INTERNAL_SERVER_ERROR, { cause: e })
    }

  }
}
