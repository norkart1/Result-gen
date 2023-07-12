import { Injectable } from '@nestjs/common';
import { CreateJudgeInput } from './dto/create-judge.input';
import { UpdateJudgeInput } from './dto/update-judge.input';

@Injectable()
export class JudgeService {
  create(createJudgeInput: CreateJudgeInput) {
    return 'This action adds a new judge';
  }

  findAll() {
    return `This action returns all judge`;
  }

  findOne(id: number) {
    return `This action returns a #${id} judge`;
  }

  update(id: number, updateJudgeInput: UpdateJudgeInput) {
    return `This action updates a #${id} judge`;
  }

  remove(id: number) {
    return `This action removes a #${id} judge`;
  }
}
