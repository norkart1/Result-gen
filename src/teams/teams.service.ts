import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTeamInput } from './dto/create-team.input';
import { UpdateTeamInput } from './dto/update-team.input';
import { Team } from './entities/team.entity';

@Injectable()
export class TeamsService {

  constructor(@InjectRepository(Team) private teamRepository:Repository<Team>) {}


  create(createTeamInput: CreateTeamInput) {
    const newTeamInput = this.teamRepository.create(createTeamInput)
    return this.teamRepository.save(newTeamInput);
  }

  findAll() {
    return this.teamRepository.find();
  }

  findOne(id: number) {
    return this.teamRepository.findOneBy({id});
  }

  update(id: number, updateTeamInput: UpdateTeamInput) {
    return this.teamRepository.update(id, updateTeamInput);
  }

  remove(id: number) {
    return this.teamRepository.delete(id);
  }
}
