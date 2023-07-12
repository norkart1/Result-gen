import { Module } from '@nestjs/common';
import { JudgeService } from './judge.service';
import { JudgeResolver } from './judge.resolver';

@Module({
  providers: [JudgeResolver, JudgeService]
})
export class JudgeModule {}
