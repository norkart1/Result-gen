import { Injectable } from '@nestjs/common';
import { CreateTeamManagerInput } from './dto/create-team-manager.input';
import { UpdateTeamManagerInput } from './dto/update-team-manager.input';

@Injectable()
export class TeamManagersService {
  create(createTeamManagerInput: CreateTeamManagerInput) {
    return 'This action adds a new teamManager';
  }

  findAll() {
    return `This action returns all teamManagers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} teamManager`;
  }

  update(id: number, updateTeamManagerInput: UpdateTeamManagerInput) {
    return `This action updates a #${id} teamManager`;
  }

  remove(id: number) {
    return `This action removes a #${id} teamManager`;
  }
}
