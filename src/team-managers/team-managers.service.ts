import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTeamManagerInput } from './dto/create-team-manager.input';
import { UpdateTeamManagerInput } from './dto/update-team-manager.input';
import { TeamManager } from './entities/team-manager.entity';

@Injectable()
export class TeamManagersService {
  constructor(@InjectRepository(TeamManager) private teamManagerRepository:Repository<TeamManager>) {}

  create(createTeamManagerInput: CreateTeamManagerInput) {
    try{
      const newTeamManagerInput = this.teamManagerRepository.create(createTeamManagerInput)
      return this.teamManagerRepository.save(newTeamManagerInput);
    }catch(e){
      throw new HttpException("An Error have when inserting data ", HttpStatus.INTERNAL_SERVER_ERROR, { cause: e })
    }
    
  }

  findAll() {
    try{
    return this.teamManagerRepository.find({ relations: ['team'] });
    }catch(e){
      throw new HttpException("An Error have when finding data ", HttpStatus.INTERNAL_SERVER_ERROR, { cause: e })
    }
  }

  findOne(id: number) {
    return this.teamManagerRepository.findOneOrFail({where:{
      id
    },
    relations: ['team']
  });
  }

  update(id: number, updateTeamManagerInput: UpdateTeamManagerInput) {

    const TeamManager = this.teamManagerRepository.findOneBy({id})
    if(!TeamManager){
      throw new HttpException(`Cant find a TeamManager `, HttpStatus.BAD_REQUEST)
    }
    // trying to update teamManager
    try{
    return this.teamManagerRepository.update(id, updateTeamManagerInput);
    }catch(e){
      throw new HttpException("An Error have when updating data ", HttpStatus.INTERNAL_SERVER_ERROR, { cause: e })
    }
  }

  remove(id: number) {
    const teamManager = this.teamManagerRepository.findOneBy({id})
    if(!teamManager){
      throw new HttpException(`Cant find a teamManager `, HttpStatus.BAD_REQUEST)
    }
    // trying to delete teamManager
    try{
    return this.teamManagerRepository.delete(id);
    }catch(e){
      throw new HttpException("An Error have when deleting data ", HttpStatus.INTERNAL_SERVER_ERROR, { cause: e })
    }
  }
}
