import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTeamManagerInput } from './dto/create-team-manager.input';
import { UpdateTeamManagerInput } from './dto/update-team-manager.input';
import { TeamManager } from './entities/team-manager.entity';

@Injectable()
export class TeamManagersService {
  constructor(@InjectRepository(TeamManager) private teamManagerRepository:Repository<TeamManager>) {}

  create(createTeamManagerInput: CreateTeamManagerInput) {
    const newTeamManagerInput = this.teamManagerRepository.create(createTeamManagerInput)
    return this.teamManagerRepository.save(newTeamManagerInput);
  }

  findAll() {
    return this.teamManagerRepository.find();
  }

  findOne(id: number) {
    return this.teamManagerRepository.findOneBy({id});
  }

  update(id: number, updateTeamManagerInput: UpdateTeamManagerInput) {
    return this.teamManagerRepository.update(id, updateTeamManagerInput);
  }

  remove(id: number) {
    return this.teamManagerRepository.delete(id);
  }
}
